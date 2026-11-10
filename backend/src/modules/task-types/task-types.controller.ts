import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';
import { TaskTypesService } from './task-types.service';

@Controller('task-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskTypesController {
  constructor(private readonly taskTypes: TaskTypesService) {}

  @Get()
  findAll() {
    return this.taskTypes.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskTypes.findOne(id);
  }

  @Post()
  @Roles('profesor')
  create(@Body() dto: CreateTaskTypeDto) {
    return this.taskTypes.create(dto);
  }

  @Patch(':id')
  @Roles('profesor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskTypeDto,
  ) {
    return this.taskTypes.update(id, dto);
  }

  @Delete(':id')
  @Roles('profesor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskTypes.remove(id);
  }
}
