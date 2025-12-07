import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImagenDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class CreateHistoriaClinicaDto {
  @IsString()
  @IsNotEmpty()
  paciente: string;

  @IsString()
  @IsNotEmpty()
  medico: string;

  @IsString()
  @IsOptional()
  cita?: string;

  @IsDateString()
  @IsOptional()
  fechaConsulta?: string;

  @IsString()
  @IsNotEmpty()
  motivoConsulta: string;

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  procedimientoRealizado: string;

  @IsString()
  @IsOptional()
  tratamientoIndicado?: string;

  @IsString()
  @IsOptional()
  medicamentos?: string;

  @IsString()
  @IsOptional()
  recomendaciones?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagenDto)
  @IsOptional()
  imagenes?: ImagenDto[];

  @IsDateString()
  @IsOptional()
  proximaCita?: string;
}
