import mongoose from 'mongoose';

export const tratamientoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  duracion: { type: Number, required: true },
  imagen: { type: String, required: false },
  estado: { type: String, default: 'activo' },
});

export interface ITratamiento extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  imagen?: string;
  estado?: string;
}

export const TratamientoModel = {
  name: 'Tratamiento',
  schema: tratamientoSchema,
};
