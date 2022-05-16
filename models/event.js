import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema(
	{
		start: { type: Date },
		end: { type: Date },
		title: { type: String },
	},
	{
		timestamps: true,
	}
);
const Evento = mongoose.model('Evento', eventoSchema);
export default Evento;
