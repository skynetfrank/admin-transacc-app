import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, unique: true },
    rif: { type: String, required: true },
    celular: { type: String },
    telefono: { type: String },
    direccion: { type: String, required: true },
    condiciones: { type: String },
    diasCredito: { type: String },
    descuento: { type: Number },
    prontopago: { type: Number },
    contacto: { type: String },
  },
  {
    timestamps: true,
  }
);
const Proveedor = mongoose.model('Proveedor', proveedorSchema);
export default Proveedor;
