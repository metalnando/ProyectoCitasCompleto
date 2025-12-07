import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginMedicoDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
