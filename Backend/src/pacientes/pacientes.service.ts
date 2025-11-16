import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaciente } from './schemas/pacientes.schema';
import { createPacienteDto } from './dto/create-paciente.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class PacientesService {
  constructor(
    @InjectModel('Paciente') private readonly pacienteModel: Model<IPaciente>
  ) {}

  async crearPaciente(PacienteDto: createPacienteDto): Promise<IPaciente> {
    const nuevoPaciente = new this.pacienteModel(PacienteDto);
    return nuevoPaciente.save();
  }
  // Obtener todos los pacientes
  async findAllPaciente(): Promise<IPaciente[]> {
    return this.pacienteModel.find().exec();
  }

  //Busar un paciente por id
  async findById(id: string): Promise<IPaciente> {
    //VAlida que el objeto qcon el que se va a comparar en la base de datos se encuentre correcto
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id de paciente no valido');
    }

    const paciente = await this.pacienteModel.findById(id).exec();

    if (!paciente) {
      throw new NotFoundException(`Paciente con ${id} no encontrado`);
    }
    return paciente;
  }

  // Actualizar un paciente
  async actualizarPaciente(
    id: string,
    pacienteDto: createPacienteDto
  ): Promise<IPaciente> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id de paciente no valido');
    }

    const pacienteActualizado = await this.pacienteModel
      .findByIdAndUpdate(id, pacienteDto, { new: true })
      .exec();
    if (!pacienteActualizado) {
      throw new NotFoundException(`Paciente con ${id} no encontrado`);
    }
    return pacienteActualizado;
  }

  // Eliminar Paciente
  async eliminarPaciente(
    id: string,
    createPacienteDto: createPacienteDto
  ): Promise<IPaciente> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('El id no es correcto');
    }

    const pacienteEliminado = await this.pacienteModel
      .findByIdAndDelete(id)
      .exec();

    if (!pacienteEliminado) {
      throw new NotFoundException(`Paciente con ${id} no encontrado`);
    }
    return pacienteEliminado;
  }
}
