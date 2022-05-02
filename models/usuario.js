import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String, required: false },
    comision: { type: Number, default: 0, required: false },
    ventasmes: { type: Number, default: 0, required: false },
    ventastotal: { type: Number, default: 0, required: false },
    isAdmin: { type: Boolean, default: false, required: true },
    isVendedor: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
export default User;
