import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuarios } from '../usuarios/schema/usuarios.schema';
import { ICitas } from '../citas/Schema/citas.schema';
import { IMedico } from '../medico/schema/medico.schema';
import { ITratamiento } from '../tratamientos/schema/tratamiento.schema';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel('User') private usuarioModel: Model<IUsuarios>,
    @InjectModel('citasModel') private citasModel: Model<ICitas>,
    @InjectModel('Medicos') private medicoModel: Model<IMedico>,
    @InjectModel('Tratamiento') private tratamientoModel: Model<ITratamiento>,
  ) {}

  async obtenerEstadisticasGenerales() {
    // Contar usuarios
    const totalUsuarios = await this.usuarioModel.countDocuments().exec();

    // Contar citas
    const totalCitas = await this.citasModel.countDocuments().exec();

    // Contar médicos
    const totalMedicos = await this.medicoModel.countDocuments().exec();

    // Contar tratamientos
    const totalTratamientos = await this.tratamientoModel.countDocuments().exec();

    // Calcular ganancias totales (citas completadas)
    const citasCompletadas = await this.citasModel
      .find({ estado: 'completada' })
      .populate('tratamiento')
      .exec();

    const gananciasTotales = citasCompletadas.reduce((total, cita) => {
      const precio = (cita.tratamiento as any)?.precio || 0;
      return total + precio;
    }, 0);

    // Citas de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const citasHoy = await this.citasModel
      .countDocuments({
        fecha: {
          $gte: hoy.toISOString().split('T')[0],
          $lt: manana.toISOString().split('T')[0],
        },
      })
      .exec();

    // Citas pendientes
    const citasPendientes = await this.citasModel
      .countDocuments({ estado: 'pendiente' })
      .exec();

    // Promedio de citas por día (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const citasUltimos30Dias = await this.citasModel
      .countDocuments({
        fecha: { $gte: hace30Dias.toISOString().split('T')[0] },
      })
      .exec();

    const promedioCitasDia = Math.round(citasUltimos30Dias / 30);

    return {
      totalUsuarios,
      totalCitas,
      totalMedicos,
      totalTratamientos,
      gananciasTotales,
      citasHoy,
      citasPendientes,
      promedioCitasDia,
    };
  }

  async obtenerTratamientosPopulares() {
    const citasConTratamiento = await this.citasModel
      .find({})
      .populate('tratamiento')
      .exec();

    // Agrupar por tratamiento y contar
    const tratamientosMap = new Map();

    citasConTratamiento.forEach((cita) => {
      const tratamiento = cita.tratamiento as any;
      if (tratamiento && tratamiento._id) {
        const id = tratamiento._id.toString();
        if (!tratamientosMap.has(id)) {
          tratamientosMap.set(id, {
            nombre: tratamiento.nombre,
            cantidad: 0,
            ingresos: 0,
          });
        }

        const item = tratamientosMap.get(id);
        item.cantidad++;
        if (cita.estado === 'completada') {
          item.ingresos += tratamiento.precio || 0;
        }
      }
    });

    // Convertir a array y ordenar por cantidad
    const tratamientosArray = Array.from(tratamientosMap.values());
    tratamientosArray.sort((a, b) => b.cantidad - a.cantidad);

    // Retornar top 5
    return tratamientosArray.slice(0, 5);
  }

  async obtenerUsuariosDetalle() {
    const usuarios = await this.usuarioModel
      .find()
      .select('-password')
      .sort({ _id: -1 })
      .limit(100)
      .exec();

    return usuarios.map((user) => ({
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      documento: user.documento,
      telefono: user.telefono,
      roles: user.roles,
    }));
  }

  async obtenerCitasDetalle() {
    const citas = await this.citasModel
      .find()
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento')
      .populate('medico', 'medicoNombre medicoApellido')
      .populate('tratamiento', 'nombre precio')
      .sort({ fecha: -1 })
      .limit(100)
      .exec();

    return citas.map((cita) => ({
      id: cita._id,
      fecha: cita.fecha,
      hora: cita.hora,
      paciente: cita.paciente,
      medico: cita.medico,
      tratamiento: cita.tratamiento,
      estado: cita.estado,
      motivo: cita.motivo,
    }));
  }

  async obtenerCitasPendientesDetalle() {
    const citas = await this.citasModel
      .find({ estado: 'pendiente' })
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento')
      .populate('medico', 'medicoNombre medicoApellido')
      .populate('tratamiento', 'nombre precio')
      .sort({ fecha: 1 })
      .exec();

    return citas.map((cita) => ({
      id: cita._id,
      fecha: cita.fecha,
      hora: cita.hora,
      paciente: cita.paciente,
      medico: cita.medico,
      tratamiento: cita.tratamiento,
      motivo: cita.motivo,
    }));
  }
}
