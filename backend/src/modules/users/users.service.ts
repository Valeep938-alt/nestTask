import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { dbErrorCode } from '../../common/utils/db-error';
import { ROLE_NAMES, Role, RoleName } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
  ) {}

  // Nunca se devuelve el hash; el rol sale como texto
  private toResponse(user: User) {
    const { password_hash, role, ...rest } = user;
    return { ...rest, role: role?.name };
  }

  private async getRole(name: RoleName): Promise<Role> {
    const role = await this.roles.findOne({ where: { name } });
    if (!role) throw new BadRequestException(`Rol inválido: ${name}`);
    return role;
  }

  private handleDbError(error: unknown): never {
    if (dbErrorCode(error) === '23505') {
      throw new ConflictException('El correo ya está registrado');
    }
    throw error;
  }

  async create(dto: CreateUserDto) {
    const role = await this.getRole(dto.role);
    const user = this.users.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password_hash: await bcrypt.hash(dto.password, 10),
      role,
    });

    try {
      return this.toResponse(await this.users.save(user));
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(role?: string) {
    if (role && !ROLE_NAMES.includes(role as RoleName)) {
      throw new BadRequestException(`Rol inválido: ${role}`);
    }
    const list = await this.users.find({
      where: role ? { role: { name: role as RoleName } } : {},
      order: { created_at: 'DESC' },
    });
    return list.map((u) => this.toResponse(u));
  }

  async findOne(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toResponse(user);
  }

  // Uso interno del login: incluye password_hash
  findByEmail(email: string) {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email.toLowerCase();
    if (dto.is_active !== undefined) user.is_active = dto.is_active;
    if (dto.password) user.password_hash = await bcrypt.hash(dto.password, 10);
    if (dto.role) user.role = await this.getRole(dto.role);

    try {
      return this.toResponse(await this.users.save(user));
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: string) {
    const result = await this.users.delete(id);
    if (!result.affected) throw new NotFoundException('Usuario no encontrado');
    return { message: 'Usuario eliminado' };
  }
}
