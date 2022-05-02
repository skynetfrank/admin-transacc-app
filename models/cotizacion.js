import mongoose from 'mongoose';

const cotizacionSchema = new mongoose.Schema(
  {
    cotizacionItems: [
      {
        nombre: { type: String, required: true },
        descripcion: { type: String },
        codigo: { type: String, required: true },
        marca: { type: String },
        qty: { type: Number, required: true },
        imageurl: { type: String, required: true },
        precio: { type: Number, required: true },
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
      },
    ],
    clienteInfo: {
      nombre: { type: String },
      nic: { type: String },
      direccion: { type: String },
      telefono: { type: String },
      isTaller: { type: Boolean, default: false },
      condiciones: { type: String },
      descuento: { type: Number },
      prontopago: { type: Number },
    },
    vendedorInfo: {
      nombre: { type: String },
      apellido: { type: String },
      cedula: { type: String },
      email: { type: String },
      comision: { type: Number },
      montocomision: { type: Number },
      idVendedor: { type: String },
      isVendedor: { type: Boolean, default: false },
    },
    shippingAddress: {
      fullName: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    isVendedor: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    cambioDia: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);
export default Cotizacion;
