import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { citasModel, ICitas } from './Schema/citas.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { IPaciente } from 'src/pacientes/schemas/pacientes.schema';

@Injectable()
export class CitasService {
  constructor(
    @InjectModel(citasModel.name) private readonly citasModel: Model<ICitas>,
    @InjectModel('Paciente') private readonly pacienteModel: Model<IPaciente>
  ) {}

  async crearCita(crearCitaDto: CrearCitaDto & { paciente: Types.ObjectId }) {
    console.log('ID Paciente recibido:', crearCitaDto.paciente);

    const paciente = await this.pacienteModel
      .findById(crearCitaDto.paciente)
      .exec();
    if (!paciente) {
      throw new HttpException('Paciente no encontrado', HttpStatus.NOT_FOUND);
    }

    const nuevaCita = {
      ...crearCitaDto,
      paciente: paciente._id,
      estado: 'pendiente', // Agregar estado por defecto
      fechaCreacion: new Date(),
    };

    try {
      const savedCita = await this.citasModel.create(nuevaCita);
      console.log('Cita guardada:', savedCita);
      return savedCita;
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  }

  // Obtener historial de citas por paciente
  async getHistorialByPaciente(pacienteId: string): Promise<ICitas[]> {
    if (!mongoose.Types.ObjectId.isValid(pacienteId)) {
      throw new NotFoundException('ID de paciente no válido');
    }

    return await this.citasModel
      .find({ paciente: new Types.ObjectId(pacienteId) })
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio')
      .sort({ fecha: -1, hora: -1 })
      .exec();
  }

  // Obtener citas por médico y fecha
  async getCitasByMedico(medicoId: string, fecha?: string): Promise<ICitas[]> {
    const query: any = { medico: new Types.ObjectId(medicoId) };

    if (fecha) {
      const startDate = new Date(fecha);
      const endDate = new Date(fecha);
      endDate.setDate(endDate.getDate() + 1);

      query.fecha = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    return await this.citasModel
      .find(query)
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio')
      .sort({ fecha: 1, hora: 1 })
      .exec();
  }

  // Obtener citas por estado
  async getCitasByEstado(estado: string): Promise<ICitas[]> {
    return await this.citasModel
      .find({ estado })
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio')
      .exec();
  }

  // Actualizar estado de cita
  async updateEstadoCita(id: string, estado: string): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de cita no válido');
    }

    const citaActualizada = await this.citasModel
      .findByIdAndUpdate(
        id,
        { estado, fechaActualizacion: new Date() },
        { new: true }
      )
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio');

    if (!citaActualizada) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return citaActualizada;
  }

  // Mostrar todas las citas agendadas
  async getCitas(): Promise<ICitas[]> {
    return await this.citasModel
      .find()
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio')
      .exec();
  }

  async getCitaById(id: string): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no válido');
    }

    const cita = await this.citasModel
      .findById(id)
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono pacienteDireccion')
      .populate('medico', 'medicoNombre medicoApellido especialidad medicoTelefono')
      .populate('tratamiento', 'nombre precio')
      .exec();

    if (!cita) {
      throw new NotFoundException(
        `El id ${id} no se encuentra en la base de datos`
      );
    }
    return cita;
  }

  // Actualizar la cita
  async updateCita(id: string, crearCitaDto: CrearCitaDto): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no es válido');
    }

    const citaActualizada = await this.citasModel
      .findByIdAndUpdate(
        id,
        { ...crearCitaDto, fechaActualizacion: new Date() },
        { new: true }
      )
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio');

    if (!citaActualizada) {
      throw new NotFoundException(
        `El id ${id} no se encuentra en la base de datos`
      );
    }
    return citaActualizada;
  }

  // Eliminar Cita (cambiar a eliminación lógica)
  async deleteCita(id: string): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no es válido');
    }

    // En lugar de eliminar, marcar como cancelada
    const citaCancelada = await this.citasModel.findByIdAndUpdate(
      id,
      { estado: 'cancelada', fechaActualizacion: new Date() },
      { new: true }
    );

    if (!citaCancelada) {
      throw new NotFoundException(
        `El id ${id} no se encuentra en la base de datos`
      );
    }
    return citaCancelada;
  }

  // Eliminación física (solo si es necesario)
  async eliminarCitaFisicamente(id: string): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no es válido');
    }

    const citaEliminada = await this.citasModel.findByIdAndDelete(id);
    if (!citaEliminada) {
      throw new NotFoundException(
        `El id ${id} no se encuentra en la base de datos`
      );
    }
    return citaEliminada;
  }

  // Registrar pago de cita
  async registrarPago(
    id: string,
    metodoPago: string,
    comprobantePago?: string,
  ): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no es válido');
    }

    const citaPagada = await this.citasModel.findByIdAndUpdate(
      id,
      {
        estadoPago: 'pagada',
        fechaPago: new Date(),
        metodoPago,
        comprobantePago,
        habilitada: true,
        fechaActualizacion: new Date(),
      },
      { new: true }
    )
      .populate('paciente', 'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono')
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio');

    if (!citaPagada) {
      throw new NotFoundException(
        `El id ${id} no se encuentra en la base de datos`
      );
    }

    return citaPagada;
  }
}
