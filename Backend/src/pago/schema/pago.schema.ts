import { Types } from 'mongoose';
import mongoose from 'mongoose';

export const pagoSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  monto: { type: Number, required: true },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    required: true,
  },
  estado: {
    type: String,
    enum: ['pago', 'pendiente', 'fallido', 'reembolsado'],
    required: true,
  },
  factura: { type: mongoose.Types.ObjectId, ref: 'Factura', required: true },
  paciente: { type: mongoose.Types.ObjectId, ref: 'Paciente', required: true },
});

export interface IPago extends mongoose.Document {
  _id: Types.ObjectId;
  fecha: Date;
  monto: number;
  metodoPago: string;
  estado: string;
  factura: mongoose.Types.ObjectId;
  paciente: mongoose.Types.ObjectId;
}

export const pagoModel = { name: 'Pago', schema: pagoSchema };
