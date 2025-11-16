import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFacturaDto {
  @IsNumber()
  saldoPendiente: number;

  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @IsString()
  @IsNotEmpty()
  tratamientoId: string;

  @IsString()
  @IsOptional()
  citaId?: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsNumber()
  @IsOptional()
  PagoInicial?: number;

  @IsString()
  metodoPago?: string;
}
