import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TASK_STATUSES, TaskStatus } from '../../../entities/task.entity';

export class CreateTaskDto {
  // Estudiante al que se le asigna la tarea
  @IsUUID()
  user_id: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  due_date?: string | null;

  @IsOptional()
  @IsInt()
  task_type_id?: number | null;
}
