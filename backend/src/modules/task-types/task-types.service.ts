import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dbErrorCode } from '../../common/utils/db-error';
import { TaskType } from '../../entities/task-type.entity';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';

@Injectable()
export class TaskTypesService {
  constructor(
    @InjectRepository(TaskType) private readonly types: Repository<TaskType>,
  ) {}

  private handleDbError(error: unknown): never {
    if (dbErrorCode(error) === '23505') {
      throw new ConflictException('Ya existe un tipo de tarea con ese nombre');
    }
    throw error;
  }

  async create(dto: CreateTaskTypeDto) {
    try {
      return await this.types.save(
        this.types.create({
          name: dto.name,
          description: dto.description ?? null,
        }),
      );
    } catch (error) {
      this.handleDbError(error);
    }
  }

  findAll() {
    return this.types.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const type = await this.types.findOne({ where: { id } });
    if (!type) throw new NotFoundException('Tipo de tarea no encontrado');
    return type;
  }

  async update(id: number, dto: UpdateTaskTypeDto) {
    const type = await this.findOne(id);
    if (dto.name !== undefined) type.name = dto.name;
    if (dto.description !== undefined) type.description = dto.description;

    try {
      return await this.types.save(type);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  // Las tareas de este tipo quedan con task_type_id = null (ON DELETE SET NULL)
  async remove(id: number) {
    const result = await this.types.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Tipo de tarea no encontrado');
    }
    return { message: 'Tipo de tarea eliminado' };
  }
}
