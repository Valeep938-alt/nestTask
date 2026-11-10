import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { ROLE_NAMES, RoleName } from '../../../entities/role.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsIn(ROLE_NAMES)
  role: RoleName;
}
