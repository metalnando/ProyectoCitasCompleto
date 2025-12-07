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
import { NotificationsService } from '../notifications/notifications.service';
import { IUsuarios } from 'src/usuarios/schema/usuarios.schema';

@Injectable()
export class CitasService {
  constructor(
    @InjectModel(citasModel.name) private readonly citasModel: Model<ICitas>,
    @InjectModel('Paciente') private readonly pacienteModel: Model<IPaciente>,
    @InjectModel('User') private readonly usuarioModel: Model<IUsuarios>,
    private readonly notificationsService: NotificationsService,
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

      // Enviar notificaciones de cita agendada (email y SMS)
      try {
        const nombrePaciente = `${paciente.pacienteNombre} ${paciente.pacienteApellido}`;

        // Intentar encontrar el email del usuario asociado al paciente
        const usuario = await this.usuarioModel.findOne({
          nombre: { $regex: new RegExp(paciente.pacienteNombre, 'i') }
        }).exec();

        const emailPaciente = usuario?.email || `${paciente.pacienteDocumento}@temporal.com`;

        console.log(`📞 Enviando notificaciones a: ${nombrePaciente}`);
        console.log(`   Email: ${emailPaciente}`);
        console.log(`   Teléfono: ${paciente.pacienteTelefono}`);

        await this.notificationsService.notificarCitaAgendada(
          nombrePaciente,
          emailPaciente,
          paciente.pacienteTelefono,
          crearCitaDto.fecha.toString(),
          crearCitaDto.hora,
          crearCitaDto.motivo,
        );

        console.log('✅ Notificaciones de cita enviadas exitosamente');
      } catch (notifError) {
        console.error('❌ Error al enviar notificaciones de cita:', notifError.message);
        console.error('⚠️  La cita se creó correctamente, pero no se pudo enviar la notificación.');
        console.error('   Verifica que el número de teléfono del paciente tenga formato válido: +57XXXXXXXXXX (10 dígitos)');
        // No lanzar el error para que la cita se cree aunque falle la notificación
      }

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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio')
      .sort({ fecha: 1, hora: 1 })
      .exec();
  }

  // Obtener citas por estado
  async getCitasByEstado(estado: string): Promise<ICitas[]> {
    return await this.citasModel
      .find({ estado })
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio')
      .exec();
  }

  // Obtener citas por usuario (busca el paciente asociado al usuario)
  async getCitasByUsuario(userId: string): Promise<ICitas[]> {
    // Primero necesitamos obtener el usuario para conocer su documento
    // Luego buscar el paciente con ese documento
    // Finalmente obtener las citas de ese paciente

    try {
      // Buscar todos los pacientes y filtrar por las citas
      // Como no tenemos relación directa usuario-paciente, buscamos todas las citas
      // y el frontend filtrará según el usuario

      // Opción: buscar citas donde el documento del paciente coincida con el del usuario
      const citas = await this.citasModel
        .find()
        .populate(
          'paciente',
          'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
        )
        .populate('medico', 'medicoNombre medicoApellido especialidad')
        .populate('tratamiento', 'nombre precio')
        .sort({ fecha: -1, hora: -1 })
        .exec();

      return citas;
    } catch (error) {
      console.error('Error al obtener citas por usuario:', error);
      throw new HttpException(
        'Error al obtener las citas del usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono pacienteDireccion'
      )
      .populate(
        'medico',
        'medicoNombre medicoApellido especialidad medicoTelefono'
      )
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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
      .populate('medico', 'medicoNombre medicoApellido especialidad')
      .populate('tratamiento', 'nombre precio');

    if (!citaActualizada) {
      throw new NotFoundException(
        `El id ${id} no se encuentra en la base de datos`
      );
    }
    return citaActualizada;
  }

  // Actualización parcial de cita (solo campos específicos)
  async updateCitaParcial(
    id: string,
    updateData: Partial<CrearCitaDto>
  ): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no es válido');
    }

    const citaActualizada = await this.citasModel
      .findByIdAndUpdate(
        id,
        { ...updateData, fechaActualizacion: new Date() },
        { new: true }
      )
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
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
    comprobantePago?: string
  ): Promise<ICitas> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id de la cita no es válido');
    }

    const citaPagada = await this.citasModel
      .findByIdAndUpdate(
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
      .populate(
        'paciente',
        'pacienteNombre pacienteApellido pacienteDocumento pacienteTelefono'
      )
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
