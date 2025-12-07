import { IsNotEmpty, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: Date;

  @IsOptional()
  roles?: string[];
}
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  roles: string[];
  save(): Promise<Usuario>;
}
