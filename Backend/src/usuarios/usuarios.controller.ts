import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Put,
  UseGuards,
  Request,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.createUsuarios(createUsuarioDto);
  }
  /// Post para el login
  @Post('login')
  async createLogin(@Body() loginUsuarioDto: LoginUsuarioDto) {
    const { email, password } = loginUsuarioDto;
    return this.usuariosService.loginUser(email, password);
  }

  @Post('refresh')
  refreshToken(@Req() request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') || [];
    return this.usuariosService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getPerfil(@Request() req: any) {
    const userId: string = req.user.sub;
    const user = await this.usuariosService.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    // No enviar la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Put('perfil')
  async actualizarPerfil(@Request() req: any, @Body() updateData: any) {
    const userId: string = req.user.sub;
    const updatedUser = await this.usuariosService.actualizarPerfil(
      userId,
      updateData
    );
    // No enviar la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  @Put('make-admin/:email')
  async convertirAAdmin(@Param('email') email: string) {
    try {
      const user = await this.usuariosService.convertirAAdmin(email);
      // No enviar la contraseña
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user.toObject();
      return {
        message: 'Usuario convertido a administrador exitosamente',
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new HttpException(
        error instanceof Error
          ? error.message
          : 'Error al convertir usuario a administrador',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
