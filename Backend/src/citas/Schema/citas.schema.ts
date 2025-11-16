import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IPaciente } from 'src/pacientes/schemas/pacientes.schema';
import { IMedico } from 'src/medico/schema/medico.schema';

export type CitasDocument = ICitas & Document;

@Schema({ timestamps: true })
export class citasModel {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Paciente',
    required: true,
  })
  paciente: IPaciente;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Medicos', required: true })
  medico: IMedico;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  hora: string;

  @Prop({ required: true })
  motivo: string;

  @Prop()
  notas?: string;

  @Prop({
    type: String,
    enum: [
      'pendiente',
      'confirmada',
      'completada',
      'cancelada',
      'reprogramada',
    ],
    default: 'pendiente',
  })
  estado: string;

  @Prop()
  duracion: number; // en minutos

  @Prop()
  consultorio: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tratamiento' })
  tratamiento?: MongooseSchema.Types.ObjectId;

  @Prop()
  costo: number;

  @Prop({
    type: String,
    enum: ['pendiente', 'pagada', 'vencida'],
    default: 'pendiente',
  })
  estadoPago: string;

  @Prop()
  fechaPago?: Date;

  @Prop()
  metodoPago?: string; // efectivo, tarjeta, transferencia

  @Prop()
  comprobantePago?: string; // URL o número de comprobante

  @Prop({ default: false })
  habilitada: boolean; // Solo true si está pagada

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop()
  fechaActualizacion: Date;
}

export const CitasSchema = SchemaFactory.createForClass(citasModel);

export interface ICitas {
  _id: string;
  paciente: IPaciente;
  medico: IMedico;
  fecha: Date;
  hora: string;
  motivo: string;
  notas?: string;
  estado: string;
  duracion: number;
  consultorio: string;
  tratamiento?: MongooseSchema.Types.ObjectId;
  costo: number;
  estadoPago: string;
  fechaPago?: Date;
  metodoPago?: string;
  comprobantePago?: string;
  habilitada: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
