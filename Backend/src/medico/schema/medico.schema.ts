import { Schema, Document } from 'mongoose';

export const medicoSchema = new Schema({
  medicoNombre: { type: String, required: true },
  medicoApellido: { type: String, required: true },
  medicoDocumento: { type: String, required: true },
  medicoTelefono: { type: String, required: true },
  medicoEmail: { type: String, required: true, unique: true },
  especialidad: { type: String, required: false, default: 'General' },
  imagen: { type: String, required: false, default: '' },
  password: { type: String, required: false },
  activo: { type: Boolean, required: false, default: true },
});

export interface IMedico extends Document {
  medicoNombre: string;
  medicoApellido: string;
  medicoDocumento: string;
  medicoTelefono: string;
  medicoEmail: string;
  especialidad?: string;
  imagen?: string;
  password?: string;
  activo?: boolean;
}

export const medicoModel = { name: 'Medicos', schema: medicoSchema };
