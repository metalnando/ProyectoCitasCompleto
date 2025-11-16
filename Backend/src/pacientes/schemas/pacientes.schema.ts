import { Schema, Document } from 'mongoose';

export const PacienteSchema = new Schema({
  pacienteNombre: { type: String, required: true },
  pacienteApellido: { type: String, required: true },
  pacienteDocumento: { type: String, required: true },
  pacienteEdad: { type: Number, required: true },
  pacienteTelefono: { type: String, required: true },
  pacienteDireccion: { type: String, required: true },
  pacienteFecha_nacimiento: { type: String, required: true },
  pacienteSexo: { type: String, required: true },
});

export interface IPaciente extends Document {
  pacienteNombre: string;
  pacienteApellido: string;
  pacienteDocumento: string;
  pacienteEdad: number;
  pacienteTelefono: string;
  pacienteDireccion: string;
  pacienteFecha_nacimiento: string;
  pacienteSexo: string;
}

export const pacienteModel = { name: 'Paciente', schema: PacienteSchema };
