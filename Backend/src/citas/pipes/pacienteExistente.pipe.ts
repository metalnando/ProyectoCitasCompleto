import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaciente } from '../../pacientes/schemas/pacientes.schema';
import { IUsuarios } from '../../usuarios/schema/usuarios.schema';

@Injectable()
export class PacienteExistentePipe implements PipeTransform {
  constructor(
    @InjectModel('Paciente') private pacienteModel: Model<IPaciente>,
    @InjectModel('User') private usuarioModel: Model<IUsuarios>
  ) {}

  async transform(value: string) {
    // Buscar paciente por documento
    let paciente = await this.pacienteModel
      .findOne({
        pacienteDocumento: value,
      })
      .exec();

    // Si no existe, intentar crear desde el usuario
    if (!paciente) {
      const usuario = await this.usuarioModel.findOne({ documento: value }).exec();

      if (!usuario) {
        throw new NotFoundException(
          `No se encontró usuario con documento ${value}. Por favor actualiza tu perfil.`
        );
      }

      // Crear paciente automáticamente desde los datos del usuario
      paciente = await this.pacienteModel.create({
        pacienteDocumento: usuario.documento,
        pacienteNombre: usuario.nombre.split(' ')[0] || usuario.nombre,
        pacienteApellido: usuario.nombre.split(' ').slice(1).join(' ') || '',
        pacienteEdad: 0, // Edad por defecto
        pacienteTelefono: usuario.telefono || 'Sin teléfono',
        pacienteDireccion: usuario.direccion || 'Sin dirección',
        pacienteFecha_nacimiento: '1990-01-01', // Fecha por defecto
        pacienteSexo: 'No especificado',
      });
    }

    return paciente._id;
  }
}
