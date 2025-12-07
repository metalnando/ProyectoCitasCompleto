import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      return await this.usuariosService.loginUser(loginDto.email, loginDto.password);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Credenciales inválidas');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      return await this.usuariosService.refreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Token inválido');
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    try {
      return await this.usuariosService.createUsuarios(createAuthDto as any);
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al registrar usuario');
    }
  }

  async validateUser(userId: string) {
    return this.usuariosService.findById(userId);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'Crea un nuevo usuario de auth';
  }

  findAll() {
    return `Devuelve todos los usuarios de auth`;
  }

  findOne(id: number) {
    return `Devuelvbe un usuario con ID #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `Actualiza usuario con ID #${id} auth`;
  }

  remove(id: number) {
    return `Remueve un usuario con ID #${id} auth`;
  }
}
