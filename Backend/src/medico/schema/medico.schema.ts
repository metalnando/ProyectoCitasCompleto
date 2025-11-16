import { Schema, Document } from 'mongoose';

export const medicoSchema = new Schema({
  medicoNombre: { type: String, required: true },
  medicoApellido: { type: String, required: true },
  medicoDocumento: { type: String, required: true },
  medicoTelefono: { type: String, required: true },
  medicoEmail: { type: String, required: true },
  especialidad: { type: String, required: false, default: 'General' },
  imagen: { type: String, required: false, default: '' },
});

export interface IMedico extends Document {
  medicoNombre: string;
  medicoApellido: string;
  medicoDocumento: string;
  medicoTelefono: string;
  medicoEmail: string;
  especialidad?: string;
  imagen?: string;
}

export const medicoModel = { name: 'Medicos', schema: medicoSchema };
