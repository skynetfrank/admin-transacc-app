import mongoose from 'mongoose';

const entradaSchema = new mongoose.Schema(
	{
		entradaItems: [
			{
				codigo: { type: String, required: true },
				nombre: { type: String, required: true },
				qty: { type: Number, required: true },
				imageurl: { type: String, required: true },
				producto: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Producto',
					required: true,
				},
				costousd: { type: Number, required: true },
				costobs: { type: Number, required: true },
			},
		],
		notaNumero: { type: String, required: true, default: 'S/N' },
		itemsPrice: { type: Number, required: true },
		shippingPrice: { type: Number, required: true },
		taxPrice: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
		fechaMovimiento: { type: Date },
		tipoMovimiento: { type: String },
		tipoDoc: { type: String },
		numeroDocumento: { type: String },
		montoTotalUSD: { type: Number, required: true },
		cambio: { type: Number, required: true },
		montoTotalBs: { type: Number, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		email: { type: String, required: true },
		proveedor: { type: String },
	},
	{
		timestamps: true,
	}
);
const Entrada = mongoose.model('Entrada', entradaSchema);
export default Entrada;
