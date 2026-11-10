import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from '../../common/types/auth-user';
import { dbErrorCode } from '../../common/utils/db-error';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

type TaskChanges = Partial<
  Pick<
    Task,
    'title' | 'description' | 'status' | 'due_date' | 'task_type_id' | 'user_id'
  >
>;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  private handleDbError(error: unknown): never {
    if (dbErrorCode(error) === '23503') {
      throw new BadRequestException('El tipo de tarea no existe');
    }
    throw error;
  }

  // Las tareas solo se pueden asignar a usuarios con rol estudiante
  private async assertStudent(userId: string) {
    const student = await this.users.findOne({ where: { id: userId } });
    if (!student) throw new NotFoundException('Estudiante no encontrado');
    if (student.role.name !== 'estudiante') {
      throw new BadRequestException(
        'La tarea solo se puede asignar a un estudiante',
      );
    }
  }

  // El profesor accede a todo; el estudiante solo a sus tareas
  private assertAccess(task: Task, user: AuthUser) {
    if (user.role !== 'profesor' && task.user_id !== user.id) {
      throw new ForbiddenException('No tienes permiso sobre esta tarea');
    }
  }

  async create(dto: CreateTaskDto, user: AuthUser) {
    await this.assertStudent(dto.user_id);
    try {
      const task = await this.tasks.save(
        this.tasks.create({
          title: dto.title,
          description: dto.description ?? null,
          status: dto.status ?? 'pending',
          due_date: dto.due_date ? new Date(dto.due_date) : null,
          task_type_id: dto.task_type_id ?? null,
          user_id: dto.user_id,
        }),
      );
      return await this.findOne(task.id, user);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  findAll(user: AuthUser) {
    return this.tasks.find({
      where: user.role === 'profesor' ? {} : { user_id: user.id },
      relations: { user: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, user: AuthUser) {
    const task = await this.tasks.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    this.assertAccess(task, user);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, user: AuthUser) {
    await this.findOne(id, user); // valida existencia y permiso

    // El estudiante solo puede cambiar el estado de su tarea
    if (user.role !== 'profesor') {
      const otherFields = Object.entries(dto).some(
        ([key, value]) => key !== 'status' && value !== undefined,
      );
      if (otherFields) {
        throw new ForbiddenException(
          'Solo puedes cambiar el estado de tus tareas',
        );
      }
    }

    const changes: TaskChanges = {};
    if (dto.title !== undefined) changes.title = dto.title;
    if (dto.description !== undefined) changes.description = dto.description;
    if (dto.status !== undefined) changes.status = dto.status;
    if (dto.due_date !== undefined) {
      changes.due_date = dto.due_date ? new Date(dto.due_date) : null;
    }
    if (dto.task_type_id !== undefined) changes.task_type_id = dto.task_type_id;
    if (dto.user_id !== undefined) {
      await this.assertStudent(dto.user_id);
      changes.user_id = dto.user_id;
    }

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException('No hay datos para actualizar');
    }

    try {
      await this.tasks.update(id, changes);
    } catch (error) {
      this.handleDbError(error);
    }
    return this.findOne(id, user);
  }

  async remove(id: string, user: AuthUser) {
    await this.findOne(id, user); // valida existencia y permiso
    await this.tasks.delete(id);
    return { message: 'Tarea eliminada' };
  }
}
