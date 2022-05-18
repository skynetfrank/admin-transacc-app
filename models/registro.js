import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema(
	{
		fecha: { type: Date },
		beneficiario: { type: String },
		referencia: { type: String },
		tipodoc: { type: String },
		categoria: { type: String },
		descripcion: { type: String },
		montobs: { type: Number, default: 0 },
		montousd: { type: Number, default: 0 },
		cambio: { type: Number, default: 0 },
		imageurl: { type: String },
	},
	{
		timestamps: true,
	}
);
const Registro = mongoose.model('Registro', registroSchema);

export default Registro;
