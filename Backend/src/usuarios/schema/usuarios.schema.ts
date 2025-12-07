import mongoose from 'mongoose';

export const usuariosSchema = new mongoose.Schema({
  //id: { type: Number, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  documento: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  fechaNacimiento: { type: Date, required: false },
  roles: [{ type: String, default: ['user'] }],
});

export interface IUsuarios extends mongoose.Document {
  //id: number;
  _id: mongoose.Types.ObjectId;
  nombre: string;
  email: string;
  password: string;
  documento: string;
  telefono: string;
  direccion: string;
  fechaNacimiento?: Date;
  roles: string[];
}

export const UserModel = { name: 'User', schema: usuariosSchema };
