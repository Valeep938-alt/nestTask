import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthUser } from '../../common/types/auth-user';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  // Solo el profesor crea tareas y las asigna a un estudiante
  @Post()
  @Roles('profesor')
  create(@Body() dto: CreateTaskDto, @Req() req: { user: AuthUser }) {
    return this.tasks.create(dto, req.user);
  }

  // Profesor: todas las tareas. Estudiante: solo las asignadas a él
  @Get()
  findAll(@Req() req: { user: AuthUser }) {
    return this.tasks.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: AuthUser },
  ) {
    return this.tasks.findOne(id, req.user);
  }

  // Profesor: edita todo. Estudiante: solo el estado
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: { user: AuthUser },
  ) {
    return this.tasks.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('profesor')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: AuthUser },
  ) {
    return this.tasks.remove(id, req.user);
  }
}
