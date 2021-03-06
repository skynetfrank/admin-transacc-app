import express from 'express';
import expressAsyncHandler from 'express-async-handler';
//import dataStock from '../models/dataStock.js';
import Registro from '../models/registro.js';
import { isAdmin, isAuth } from '../utils.js';

const registroRouter = express.Router();

registroRouter.get(
	'/',
	expressAsyncHandler(async (req, res) => {
		const pageSize = 9;
		const page = Number(req.query.pageNumber) || 1;
		const nombre = req.query.nombre || '';
		const categoria = req.query.categoria || '';

		const nameFilter = nombre
			? { beneficiario: { $regex: nombre, $options: 'i' } }
			: {};

		const categoryFilter = categoria ? { categoria } : {};

		const count = await Registro.countDocuments({
			...nameFilter,
		});

		const registros = await Registro.find({
			...nameFilter,
		})
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		res.send({ registros, page, pages: Math.ceil(count / pageSize), count });
	})
);

registroRouter.get(
	'/:id',
	expressAsyncHandler(async (req, res) => {
		const registro = await Registro.findById(req.params.id);
		console.log('PRODUCTO ENCONTRADO:', registro);
		if (registro) {
			res.send(registro);
			console.log('registro con id', registro);
		} else {
			res.status(404).send({ message: 'Registro No encontrado' });
		}
	})
);

registroRouter.post(
	'/create',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const registro = new Registro({
			fecharegistro: req.body.fecharegistro,
			fechapago: req.body.fecha,
			beneficiario: req.body.beneficiario,
			referencia: req.body.referencia,
			tipodoc: req.body.tipodoc,
			tiporegistro: req.body.tiporegistro,
			categoria: req.body.categoria,
			descripcion: req.body.descripcion,
			montobs: req.body.montobs,
			montousd: req.body.montousd,
			cambio: req.body.cambio,
			nota: req.body.nota,
			status: req.body.status,
			imageurl: req.body.imageurl,
		});
		const createdRegistro = await registro.save();

		res.send({
			_id: createdRegistro._id,
			fecharegistro: createdRegistro.fecharegistro,
			fechapago: createdRegistro.fechapago,
			beneficiario: createdRegistro.beneficiario,
			referencia: createdRegistro.referencia,
			tipooperacion: createdRegistro.tipooperacion,
			tipodoc: createdRegistro.tipodoc,
			tiporegistro: createdRegistro.tiporegistro,
			categoria: createdRegistro.categoria,
			montobs: createdRegistro.montobs,
			montousd: createdRegistro.montousd,
			cambio: createdRegistro.cambio,
			nota: createdRegistro.nota,
			status: createdRegistro.status,
			imageurl: createdRegistro.imageurl,
		});
	})
);

registroRouter.put(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const registroId = req.params.id;
		const registro = await Registro.findById(registroId);

		if (registro) {
			registro.fecharegistro = req.body.fecharegistro;
			registro.fechapago = req.body.fechapago;
			registro.beneficiario = req.body.beneficiario;
			registro.referencia = req.body.referencia;
			registro.tipodoc = req.body.tipodoc;
			registro.tiporegistro = req.body.tiporegistro;
			registro.categoria = req.body.categoria;
			registro.descripcion = req.body.descripcion;
			registro.montobs = req.body.montobs;
			registro.montousd = req.body.montousd;
			registro.cambio = req.body.cambio;
			registro.nota = req.body.nota;
			registro.status = req.body.status;
			registro.imageurl = req.body.imageurl;

			const updatedRegistro = await registro.save();
			res.send({ message: 'Registro Actualizado', registro: updatedRegistro });
		} else {
			res.status(404).send({ message: 'Registro no Encontrado' });
		}
	})
);

registroRouter.delete(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const registro = await Registro.findById(req.params.id);
		if (registro) {
			const deleteRegistro = await registro.remove();
			res.send({ message: 'Registro Eliminado', registro: deleteRegistro });
		} else {
			res.status(404).send({ message: 'Registro No Encontrado' });
		}
	})
);

export default registroRouter;
