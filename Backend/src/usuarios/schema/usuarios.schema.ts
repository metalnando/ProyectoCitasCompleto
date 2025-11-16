import mongoose from 'mongoose';

export const usuariosSchema = new mongoose.Schema({
  //id: { type: Number, unique: true },
  nombre: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  documento: { type: String, required: false, unique: true, sparse: true },
  telefono: { type: String, required: false },
  direccion: { type: String, required: false },
  roles: [{ type: String, default: ['user'] }],
});

export interface IUsuarios extends mongoose.Document {
  //id: number;
  _id: mongoose.Types.ObjectId;
  nombre: string;
  email: string;
  password: string;
  documento?: string;
  telefono?: string;
  direccion?: string;
  roles: string[];
}

export const UserModel = { name: 'User', schema: usuariosSchema };
