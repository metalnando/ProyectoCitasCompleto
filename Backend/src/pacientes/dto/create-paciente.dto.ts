import {
  IsDate,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class createPacienteDto {
  @IsString()
  @IsNotEmpty()
  pacienteNombre: string;

  @IsString()
  @IsNotEmpty()
  pacienteApellido: string;

  @IsString()
  @IsNotEmpty()
  pacienteDocumento: string;

  @IsNumber()
  pacienteEdad: number;

  @IsString()
  pacienteTelefono: string;

  @IsString()
  pacienteDireccion: string;

  @IsString()
  @IsNotEmpty()
  pacienteFecha_nacimiento: string;

  @IsString()
  pacienteSexo: string;
}
