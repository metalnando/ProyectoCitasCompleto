import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createMedicoDto {
  @IsString()
  @IsNotEmpty()
  medicoNombre: string;

  @IsString()
  medicoApellido: string;

  @IsString()
  @IsNotEmpty()
  medicoDocumento: string;

  @IsString()
  medicoTelefono: string;

  @IsString()
  medicoEmail: string;

  @IsString()
  @IsOptional()
  especialidad?: string;

  @IsString()
  @IsOptional()
  imagen?: string;
}
