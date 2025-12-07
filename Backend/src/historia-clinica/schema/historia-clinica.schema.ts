import { Schema, Document, Types } from 'mongoose';

export const historiaClinicaSchema = new Schema(
  {
    paciente: {
      type: Types.ObjectId,
      ref: 'Paciente',
      required: true,
    },
    medico: {
      type: Types.ObjectId,
      ref: 'Medicos',
      required: true,
    },
    cita: {
      type: Types.ObjectId,
      ref: 'Citas',
      required: false,
    },
    fechaConsulta: {
      type: Date,
      required: true,
      default: Date.now,
    },
    motivoConsulta: {
      type: String,
      required: true,
    },
    diagnostico: {
      type: String,
      required: true,
    },
    procedimientoRealizado: {
      type: String,
      required: true,
    },
    tratamientoIndicado: {
      type: String,
      required: false,
    },
    medicamentos: {
      type: String,
      required: false,
    },
    recomendaciones: {
      type: String,
      required: false,
    },
    observaciones: {
      type: String,
      required: false,
    },
    imagenes: [
      {
        url: { type: String, required: true },
        descripcion: { type: String, required: false },
        fecha: { type: Date, default: Date.now },
      },
    ],
    proximaCita: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface IHistoriaClinica extends Document {
  paciente: Types.ObjectId;
  medico: Types.ObjectId;
  cita?: Types.ObjectId;
  fechaConsulta: Date;
  motivoConsulta: string;
  diagnostico: string;
  procedimientoRealizado: string;
  tratamientoIndicado?: string;
  medicamentos?: string;
  recomendaciones?: string;
  observaciones?: string;
  imagenes?: Array<{
    url: string;
    descripcion?: string;
    fecha: Date;
  }>;
  proximaCita?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const historiaClinicaModel = {
  name: 'HistoriaClinica',
  schema: historiaClinicaSchema,
};
