import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  IHistoriaClinica,
  historiaClinicaModel,
} from './schema/historia-clinica.schema';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { ICitas } from '../citas/Schema/citas.schema';

@Injectable()
export class HistoriaClinicaService {
  constructor(
    @InjectModel(historiaClinicaModel.name)
    private readonly historiaClinicaModel: Model<IHistoriaClinica>,
    @InjectModel('Citas')
    private readonly citasModel: Model<ICitas>
  ) {}

  async create(
    createHistoriaClinicaDto: CreateHistoriaClinicaDto
  ): Promise<IHistoriaClinica> {
    const nuevaHistoria = new this.historiaClinicaModel(
      createHistoriaClinicaDto
    );
    return await nuevaHistoria.save();
  }

  async findAll(): Promise<IHistoriaClinica[]> {
    return await this.historiaClinicaModel
      .find()
      .populate('paciente')
      .populate('medico')
      .populate('cita')
      .sort({ fechaConsulta: -1 })
      .exec();
  }

  async findById(id: string): Promise<IHistoriaClinica> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de historia clínica no válido');
    }

    const historia = await this.historiaClinicaModel
      .findById(id)
      .populate('paciente')
      .populate('medico')
      .populate('cita')
      .exec();

    if (!historia) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    return historia;
  }

  async findByPaciente(pacienteId: string): Promise<IHistoriaClinica[]> {
    if (!Types.ObjectId.isValid(pacienteId)) {
      throw new NotFoundException('ID de paciente no válido');
    }

    try {
      return await this.historiaClinicaModel
        .find({ paciente: pacienteId })
        .populate('paciente')
        .populate('medico')
        .populate('cita')
        .sort({ fechaConsulta: -1 })
        .exec();
    } catch (error) {
      console.error('Error al buscar historial por paciente:', error);
      throw error;
    }
  }

  async findByMedico(medicoId: string): Promise<IHistoriaClinica[]> {
    if (!Types.ObjectId.isValid(medicoId)) {
      throw new NotFoundException('ID de médico no válido');
    }

    return await this.historiaClinicaModel
      .find({ medico: medicoId })
      .populate('paciente')
      .populate('medico')
      .populate('cita')
      .sort({ fechaConsulta: -1 })
      .exec();
  }

  async findByCita(citaId: string): Promise<IHistoriaClinica | null> {
    if (!Types.ObjectId.isValid(citaId)) {
      throw new NotFoundException('ID de cita no válido');
    }

    return await this.historiaClinicaModel
      .findOne({ cita: citaId })
      .populate('paciente')
      .populate('medico')
      .populate('cita')
      .exec();
  }

  async update(
    id: string,
    updateData: Partial<CreateHistoriaClinicaDto>
  ): Promise<IHistoriaClinica> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de historia clínica no válido');
    }

    // Verificar que la historia clínica existe
    const historiaExistente = await this.historiaClinicaModel
      .findById(id)
      .populate('cita')
      .exec();

    if (!historiaExistente) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    // Verificar que la cita no esté completada o cancelada
    if (historiaExistente.cita) {
      const cita = await this.citasModel.findById(historiaExistente.cita);
      if (cita && (cita.estado === 'completada' || cita.estado === 'cancelada')) {
        throw new BadRequestException(
          'No se puede modificar la historia clínica de una cita completada o cancelada'
        );
      }
    }

    const historiaActualizada = await this.historiaClinicaModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('paciente')
      .populate('medico')
      .populate('cita')
      .exec();

    if (!historiaActualizada) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    return historiaActualizada;
  }

  async addImagen(
    id: string,
    imagen: { url: string; descripcion?: string }
  ): Promise<IHistoriaClinica> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de historia clínica no válido');
    }

    const historia = await this.historiaClinicaModel
      .findById(id)
      .populate('cita')
      .exec();

    if (!historia) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    // Verificar que la cita no esté completada o cancelada
    if (historia.cita) {
      const cita = await this.citasModel.findById(historia.cita);
      if (cita && (cita.estado === 'completada' || cita.estado === 'cancelada')) {
        throw new BadRequestException(
          'No se pueden agregar imágenes a la historia clínica de una cita completada o cancelada'
        );
      }
    }

    historia.imagenes = historia.imagenes || [];
    historia.imagenes.push({
      url: imagen.url,
      descripcion: imagen.descripcion,
      fecha: new Date(),
    });

    return await historia.save();
  }

  async delete(id: string): Promise<IHistoriaClinica> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de historia clínica no válido');
    }

    // Verificar que la historia clínica existe y obtener la cita asociada
    const historiaExistente = await this.historiaClinicaModel
      .findById(id)
      .populate('cita')
      .exec();

    if (!historiaExistente) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    // Verificar que la cita no esté completada o cancelada
    if (historiaExistente.cita) {
      const cita = await this.citasModel.findById(historiaExistente.cita);
      if (cita && (cita.estado === 'completada' || cita.estado === 'cancelada')) {
        throw new BadRequestException(
          'No se puede eliminar la historia clínica de una cita completada o cancelada'
        );
      }
    }

    const historiaEliminada =
      await this.historiaClinicaModel.findByIdAndDelete(id);
    if (!historiaEliminada) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    return historiaEliminada;
  }
}
