import mongoose from 'mongoose';

const vendedorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: String, required: false, unique: true },
    fechaNacimiento: { type: Date },
    fechaInicio: { type: Date },
    fechaRetiro: { type: Date },
    sueldoMensual: { type: Number, default: 0, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String, required: false },
    comision: { type: Number, default: 0, required: false },
    acumuladoVentas: { type: Number, default: 0, required: false },
    observaciones: String,
    isSeller: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);
const Vendedor = mongoose.model('Vendedor', vendedorSchema);
export default Vendedor;
