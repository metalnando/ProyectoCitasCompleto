import { Injectable, NotFoundException } from '@nestjs/common';
import { createMedicoDto } from './dto/crear-medico.dto';
import { IMedico, medicoModel } from './schema/medico.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MedicoService {
  constructor(
    @InjectModel(medicoModel.name) private readonly medicoModel: Model<IMedico>
  ) {}

  async createMedico(createMedicoDto: createMedicoDto): Promise<IMedico> {
    const createMedico = new this.medicoModel(createMedicoDto);
    return await createMedico.save();
  }

  async getMedicos(): Promise<IMedico[]> {
    return await this.medicoModel.find().exec();
  }

  async findById(id: string): Promise<IMedico> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id del Medico no valido');
    }
    const medico = await this.medicoModel.findById(id);
    if (!medico) {
      throw new NotFoundException(
        `El id ${id} no se enucentra en la base de datos`
      );
    }
    return medico;
  }

  // Actualizar el medico
  async updateMedico(
    id: string,
    createMedicoDto: createMedicoDto
  ): Promise<IMedico> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id del Medico no es correcto');
    }
    const medicoActualizado = await this.medicoModel
      .findByIdAndUpdate(id, createMedicoDto, { new: true })
      .exec();
    if (!medicoActualizado) {
      throw new NotFoundException(
        `El id ${id} no se enucentra en la base de datos`
      );
    }
    return medicoActualizado;
  }

  //Eliminar el medico
  async deleteMedico(
    id: string
    //crearMedicoDto: createMedicoDto,
  ): Promise<IMedico> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id del Medico no es correcto');
    }
    const medicoEliminado = await this.medicoModel.findByIdAndDelete(id).exec();
    if (!medicoEliminado) {
      throw new NotFoundException(
        `El medico con el ${id} no se encuentra en la base de datos`
      );
    }
    return medicoEliminado;
  }
}
