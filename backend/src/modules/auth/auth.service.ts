import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const role = user.role.name;
    const access_token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role,
    });

    return {
      access_token,
      user: { id: user.id, name: user.name, email: user.email, role },
    };
  }

  // Registro público: siempre crea un estudiante
  register(dto: RegisterDto) {
    return this.users.create({ ...dto, role: 'estudiante' });
  }
}
