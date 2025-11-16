import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(12)
  @IsString()
  password: string;
}
