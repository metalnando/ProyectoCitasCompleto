import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ITratamiento, TratamientoModel } from './schema/tratamiento.schema';
import { createTratamientoDto } from './dto/createTratamiento.dto';
import { Model } from 'mongoose';

@Injectable()
export class TratamientoService {
  constructor(
    @InjectModel(TratamientoModel.name)
    private tratamientoModel: Model<ITratamiento>
  ) {}

  async crearTratamiento(
    createTratamientoDto: createTratamientoDto
  ): Promise<ITratamiento> {
    const createdTratamiento = new this.tratamientoModel({
      ...createTratamientoDto,
      activo: createTratamientoDto.activo ?? true,
    });
    return createdTratamiento.save();
  }

  async findAll(activo?: boolean): Promise<ITratamiento[]> {
    const query = activo !== undefined ? { activo } : {};
    return this.tratamientoModel.find().exec();
  }

  async findOne(id: string): Promise<ITratamiento> {
    const tratamiento = await this.tratamientoModel.findById(id).exec();
    if (!tratamiento) {
      throw new Error(`Tratamiento con ID ${id} no encontrado`);
    }
    return tratamiento;
  }

  async delete(id: string): Promise<ITratamiento> {
    const tratamiento = await this.tratamientoModel
      .findByIdAndDelete(id)
      .exec();
    if (!tratamiento) {
      throw new Error('Tratamiento no encontrado');
    }
    return tratamiento;
  }

  async update(
    id: string,
    updateTratamientoDto: createTratamientoDto
  ): Promise<ITratamiento> {
    const tratamiento = await this.tratamientoModel
      .findByIdAndUpdate(id, updateTratamientoDto, { new: true })
      .exec();
    if (!tratamiento) {
      throw new HttpException(
        'Tratamiento no encontrado',
        HttpStatus.NOT_FOUND
      );
    }
    return tratamiento;
  }
}
