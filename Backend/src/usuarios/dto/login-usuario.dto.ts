import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
