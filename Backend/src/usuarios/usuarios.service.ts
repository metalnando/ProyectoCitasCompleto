import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcryptModule from 'bcrypt';
const bcrypt = bcryptModule;

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { IUsuarios } from './schema/usuarios.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel('User') private readonly usuarioModel: Model<IUsuarios>,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Buscar usuario por email (case-insensitive) */
  async findByEmail(email: string): Promise<IUsuarios | null> {
    // Convertir el email a minúsculas para búsqueda case-insensitive
    return await this.usuarioModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    }).exec();
  }

  /** Buscar usuario por ID */
  async findById(userId: string): Promise<IUsuarios | null> {
    return await this.usuarioModel.findById(userId).exec();
  }

  /** Crear usuario */
  async create(createUsuarioDto: CreateUsuarioDto): Promise<IUsuarios> {
    const newUser = new this.usuarioModel({
      nombre: createUsuarioDto.nombre,
      email: createUsuarioDto.email,
      password: createUsuarioDto.password,
      documento: createUsuarioDto.documento,
      telefono: createUsuarioDto.telefono,
      direccion: createUsuarioDto.direccion,
      roles: createUsuarioDto.roles || ['user'],
    });

    return await newUser.save();
  }

  /** Crear usuario (alias para compatibilidad) */
  async createUsuarios(createUsuarioDto: CreateUsuarioDto): Promise<IUsuarios> {
    if (createUsuarioDto.password) {
      createUsuarioDto.password = await bcrypt.hash(
        createUsuarioDto.password,
        10
      );
    }
    const nuevoUsuario = await this.create(createUsuarioDto);

    // Enviar notificaciones de bienvenida (email y SMS)
    try {
      await this.notificationsService.notificarRegistroUsuario(
        nuevoUsuario.nombre,
        nuevoUsuario.email,
        nuevoUsuario.telefono,
      );
    } catch (error) {
      console.error('Error al enviar notificaciones de registro:', error);
      // No lanzar el error para que el registro se complete aunque falle la notificación
    }

    return nuevoUsuario;
  }

  /** Login: genera tokens */
  async loginUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('El correo electrónico ingresado no está registrado');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('La contraseña ingresada es incorrecta');
    }

    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user._id.toString() },
      { expiresIn: '7d' }
    );

    // Retornar datos del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user: userWithoutPassword,
    };
  }

  /** Refresh token */
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.findById(payload.sub);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const accessToken = this.jwtService.sign({
        sub: user._id.toString(),
        email: user.email,
        roles: user.roles,
      });

      return { accessToken };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /** Actualizar perfil de usuario */
  async actualizarPerfil(
    userId: string,
    updateData: {
      nombre?: string;
      email?: string;
      documento?: string;
      telefono?: string;
      direccion?: string;
      currentPassword?: string;
      newPassword?: string;
    }
  ): Promise<IUsuarios> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Si se proporciona nueva contraseña, validar la actual
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new Error('Debe proporcionar la contraseña actual');
      }

      const isValid = await bcrypt.compare(updateData.currentPassword, user.password);
      if (!isValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hashear la nueva contraseña
      updateData.newPassword = await bcrypt.hash(updateData.newPassword, 10);
    }

    // Actualizar campos
    if (updateData.nombre) user.nombre = updateData.nombre;
    if (updateData.email) user.email = updateData.email;
    if (updateData.documento !== undefined) user.documento = updateData.documento;
    if (updateData.telefono !== undefined) user.telefono = updateData.telefono;
    if (updateData.direccion !== undefined) user.direccion = updateData.direccion;
    if (updateData.newPassword) user.password = updateData.newPassword;

    return await user.save();
  }

  /** Convertir usuario a administrador */
  async convertirAAdmin(email: string): Promise<IUsuarios> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
      await user.save();
    }

    return user;
  }
}
