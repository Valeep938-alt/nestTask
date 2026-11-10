import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskTypeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
