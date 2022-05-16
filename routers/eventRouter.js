import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Evento from '../models/event.js';
import { isAdmin, isAuth } from '../utils.js';

const settingsRouter = express.Router();

settingsRouter.get(
	'/',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const eventos = await Evento.find({});
		res.send(eventos);
	})
);

productRouter.post(
	'/agregarevento',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const evento = new Evento({
			start: req.body.start,
			end: req.body.end,
			title: req.body.title,
		});
		const createdEvent = await evento.save();

		res.send(createdEvent);
	})
);

settingsRouter.get(
	'/:id',
	expressAsyncHandler(async (req, res) => {
		const evento = await Evento.findById(req.params.id);
		if (evento) {
			res.send(evento);
		} else {
			res.status(404).send({ message: 'evento No Encontrado' });
		}
	})
);

settingsRouter.get(
	'/seed',
	expressAsyncHandler(async (req, res) => {
		//await Proveedor.remove({});

		const seedEventos = await Evento.insertMany({
			cambioDiaAdmin: 4.45,
		});
		res.send({ seedSettings });
	})
);

settingsRouter.put(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		console.log('settings recibida: req.body', req.body);
		const settings = await Settings.findById(req.body._id);
		if (settings) {
			settings.cambioDiaAdmin =
				req.body.cambioDiaAdmin || settings.cambioDiaAdmin;
			const updatedsettings = await settings.save();
			res.send({
				_id: updatedsettings._id,
				cambioDiaAdmin: updatedsettings.cambioDiaAdmin,
			});
		}
	})
);

export default settingsRouter;
