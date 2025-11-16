import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
} from 'class-validator';

export class CrearCitaDto {
  @IsMongoId()
  medico: string;

  @IsDateString()
  fecha: Date;

  @IsString()
  hora: string;

  @IsString()
  motivo: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsNumber()
  duracion?: number;

  @IsOptional()
  @IsString()
  consultorio?: string;

  @IsOptional()
  @IsMongoId()
  tratamiento?: string;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsOptional()
  @IsString()
  pacienteDocumento?: string; // Para buscar por documento
}
