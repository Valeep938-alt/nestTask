import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthUser } from '../../common/types/auth-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  @Roles('profesor')
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  @Roles('profesor')
  findAll(@Query('role') role?: string) {
    return this.users.findAll(role);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: AuthUser },
  ) {
    this.assertSelfOrProfesor(req.user, id);
    return this.users.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: { user: AuthUser },
  ) {
    this.assertSelfOrProfesor(req.user, id);
    // Un estudiante no puede cambiar su rol ni su estado
    if (req.user.role !== 'profesor') {
      delete dto.role;
      delete dto.is_active;
    }
    return this.users.update(id, dto);
  }

  @Delete(':id')
  @Roles('profesor')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.remove(id);
  }

  private assertSelfOrProfesor(user: AuthUser, id: string) {
    if (user.role !== 'profesor' && user.id !== id) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }
  }
}
