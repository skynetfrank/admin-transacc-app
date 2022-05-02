import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String },
    rif: { type: String, required: true, unique: true, maxlength: 10 },
    celular: { type: String },
    telefono: { type: String },
    direccion: { type: String, required: true },
    isTaller: { type: Boolean, default: false },
    condiciones: { type: String },
    descuento: { type: Number },
    prontopago: { type: Number },
    contacto: { type: String },
  },
  {
    timestamps: true,
  }
);
const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;
