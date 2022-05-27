import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema(
	{
		fecharegistro: { type: Date },
		fechapago: { type: Date },
		beneficiario: { type: String },
		referencia: { type: String },
		tiporegistro: { type: String },
		tipodoc: { type: String },
		categoria: { type: String },
		descripcion: { type: String },
		montobs: { type: Number, default: 0 },
		montousd: { type: Number, default: 0 },
		cambio: { type: Number, default: 0 },
		status: { type: String },
		nota: { type: String },
		imageurl: { type: String },
	},
	{
		timestamps: true,
	}
);
const Registro = mongoose.model('Registro', registroSchema);

export default Registro;
