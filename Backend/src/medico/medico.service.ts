import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { createMedicoDto } from './dto/crear-medico.dto';
import { IMedico, medicoModel } from './schema/medico.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MedicoService {
  constructor(
    @InjectModel(medicoModel.name)
    private readonly medicoModel: Model<IMedico>,
    private readonly jwtService: JwtService
  ) {}

  async createMedico(createMedicoDto: createMedicoDto): Promise<IMedico> {
    // Verificar si ya existe un médico con ese email
    const existingMedico = await this.medicoModel.findOne({
      medicoEmail: createMedicoDto.medicoEmail,
    });
    if (existingMedico) {
      throw new ConflictException('Ya existe un médico con ese email');
    }

    // Si se proporciona password, encriptarla
    if (createMedicoDto.password) {
      const salt = await bcrypt.genSalt(10);
      createMedicoDto.password = await bcrypt.hash(
        createMedicoDto.password,
        salt
      );
    }

    const createMedico = new this.medicoModel(createMedicoDto);
    return await createMedico.save();
  }

  async getMedicos(): Promise<IMedico[]> {
    return await this.medicoModel.find().select('-password').exec();
  }

  async findById(id: string): Promise<IMedico> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id del Medico no valido');
    }
    const medico = await this.medicoModel.findById(id).select('-password');
    if (!medico) {
      throw new NotFoundException(
        `El id ${id} no se enucentra en la base de datos`
      );
    }
    return medico;
  }

  async findByEmail(email: string): Promise<IMedico | null> {
    // Búsqueda case-insensitive del email
    return await this.medicoModel.findOne({
      medicoEmail: { $regex: new RegExp(`^${email}$`, 'i') }
    }).exec();
  }

  // Login de médico
  async loginMedico(
    email: string,
    password: string
  ): Promise<{ medico: IMedico; token: string }> {
    // Búsqueda case-insensitive del email
    const medico = await this.medicoModel.findOne({
      medicoEmail: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!medico) {
      throw new UnauthorizedException('El correo electrónico ingresado no está registrado como médico');
    }

    if (!medico.password) {
      throw new UnauthorizedException(
        'Este médico no tiene credenciales de acceso configuradas'
      );
    }

    if (!medico.activo) {
      throw new UnauthorizedException('Cuenta de médico desactivada');
    }

    const isPasswordValid = await bcrypt.compare(password, medico.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña ingresada es incorrecta');
    }

    const payload = {
      sub: medico._id,
      email: medico.medicoEmail,
      nombre: `${medico.medicoNombre} ${medico.medicoApellido}`,
      tipo: 'medico',
    };

    const token = this.jwtService.sign(payload);

    // Retornar médico sin password
    const medicoSinPassword = medico.toObject();
    delete medicoSinPassword.password;

    return {
      medico: medicoSinPassword as IMedico,
      token,
    };
  }

  // Actualizar contraseña del médico
  async setPassword(id: string, password: string): Promise<IMedico> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id del Medico no es correcto');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const medico = await this.medicoModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .select('-password')
      .exec();

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
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

    // No actualizar password directamente
    const updateData = { ...createMedicoDto };
    delete updateData.password;

    const medicoActualizado = await this.medicoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();
    if (!medicoActualizado) {
      throw new NotFoundException(
        `El id ${id} no se enucentra en la base de datos`
      );
    }
    return medicoActualizado;
  }

  //Eliminar el medico
  async deleteMedico(id: string): Promise<IMedico> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id del Medico no es correcto');
    }
    const medicoEliminado = await this.medicoModel
      .findByIdAndDelete(id)
      .exec();
    if (!medicoEliminado) {
      throw new NotFoundException(
        `El medico con el ${id} no se encuentra en la base de datos`
      );
    }
    return medicoEliminado;
  }
}
