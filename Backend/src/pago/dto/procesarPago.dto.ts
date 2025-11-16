import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class DetallesTarjetaDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}

export class ProcesarPagoDto {
  @IsString()
  @IsNotEmpty()
  facturaId: string;

  @IsNumber()
  @Min(1, { message: 'El monto debe ser mayor a 0' })
  pagoTotal: number;

  @IsEnum(['tarjeta', 'efectivo', 'transferencia'], {
    message:
      'Método de pago no válido. Opciones: tarjeta, efectivo, transferencia',
  })
  metodoPago: 'tarjeta' | 'efectivo' | 'transferencia';

  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  referencia?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notas?: string;

  @IsOptional()
  @ValidateNested() // valida las clases anidadas
  @Type(() => DetallesTarjetaDto)
  detallesTarjeta?: DetallesTarjetaDto;
}
