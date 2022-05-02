import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, required: true },
    ubicacion: { type: String },
    nombre: { type: String, maxlength: 50, required: true },
    marca: { type: String },
    presentacion: { type: String },
    unidades: { type: Number, min: 1 },
    vehiculo: { type: [], default: [] },
    modelos: { type: [], default: [] },
    years: { type: [], default: [] },
    motores: { type: [], default: [] },
    tags: { type: [], default: [] },
    categoria: { type: String },
    descripcion: { type: String, maxlength: 100 },
    existencia: { type: Number, default: 0 },
    reposicion: { type: Number, default: 0 },
    costobs: { type: Number, default: 0 },
    costousd: { type: Number, default: 0 },
    preciobs: { type: Number, default: 0 },
    preciousd: { type: Number, default: 0 },
    proveedor: { type: String },
    imageurl: {
      type: String,
      default: 'https://res.cloudinary.com/lacimaimg/image/upload/v1648130326/productos/lacima_xpfgx9.jpg',
    },
  },
  {
    timestamps: true,
  }
);
const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
