import mongoose, { Types } from 'mongoose';

export const facturaSchema = new mongoose.Schema({
  fechaEmision: { type: Date, default: Date.now, required: true },
  total: { type: Number, required: true },
  saldoPendiente: { type: Number, required: true },
  estado: { type: String, required: true },
  // pagos : { type: mongoose.Types.ObjectId, ref: 'Pago', required:true },
  paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente', required: true },
  tratamiento: { type: mongoose.Types.ObjectId, ref: 'Tratamiento' },
  cita: { type: mongoose.Types.ObjectId, ref: 'Cita' },
  descripcion: String,
  notas: String,
});

export interface Ifactura extends mongoose.Document {
  _id: Types.ObjectId;
  //fechaEmision: Date;
  total: number;
  saldoPendiente: number;
  estado: string;
  //pagos: Types.ObjectId[];
  paciente: Types.ObjectId;
  tratamiento?: Types.ObjectId;
  cita?: Types.ObjectId;
  descripcion?: string;
  notas?: string;
}

export const facturaModel = { name: 'Factura', schema: facturaSchema };
