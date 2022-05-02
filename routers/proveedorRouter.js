import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Proveedor from '../models/proveedor.js';
import { isAdmin, isAuth } from '../utils.js';

const proveedorRouter = express.Router();

proveedorRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proveedores = await Proveedor.find({});
    res.send(proveedores);
  })
);

proveedorRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await Proveedor.remove({});
    //const createdProveedores = await Proveedor.insertMany(data.proveedores);
    //res.send({ createdProveedores });
  })
);

//Registrar Empresas Proveedoras para crear una simple lista
proveedorRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const proveedor = new Proveedor({
      nombre: req.body.nombre,
      email: req.body.email,
      rif: req.body.rif,
      celular: req.body.celular,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      condiciones: req.body.condiciones,
      diasCredito: req.body.diasCredito,
      descuento: req.body.descuento,
      prontopago: req.body.prontopago,
      contacto: req.body.contacto,
    });
    const createdProveedor = await proveedor.save();
    res.send({
      _id: createdProveedor._id,
      nombre: createdProveedor.nombre,
      email: createdProveedor.email,
      rif: createdProveedor.rif,
      celular: createdProveedor.celular,
      telefono: createdProveedor.telefono,
      direccion: createdProveedor.direccion,
      condiciones: createdProveedor.condiciones,
      diasCredito: createdProveedor.diasCredito,
      descuento: createdProveedor.descuento,
      prontopago: createdProveedor.prontopago,
      contacto: createdProveedor.contacto,
    });
  })
);

proveedorRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const proveedor = await Proveedor.findById(req.params.id);
    if (proveedor) {
      res.send(proveedor);
    } else {
      res.status(404).send({ message: 'Proveedor No Existe' });
    }
  })
);
proveedorRouter.put(
  '/profile',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proveedor = await Proveedor.findById(req.body._id);
    if (proveedor) {
      proveedor.nombre = req.body.nombre || proveedor.nombre;
      proveedor.email = req.body.email || proveedor.email;
      proveedor.rif = req.body.rif || proveedor.rif;
      proveedor.celular = req.body.celular || proveedor.celular;
      proveedor.telefono = req.body.telefono || proveedor.telefono;
      proveedor.direccion = req.body.direccion || proveedor.direccion;
      proveedor.condiciones = req.body.condiciones || proveedor.condiciones;
      proveedor.diasCredito = req.body.diasCredito || proveedor.diasCredito;
      proveedor.descuento = req.body.descuento || proveedor.descuento;
      proveedor.prontopago = req.body.prontopago || proveedor.prontopago;
      proveedor.contacto = req.body.contacto || proveedor.contacto;

      const updatedProveedor = await proveedor.save();
      res.send({
        _id: updatedProveedor._id,
        nombre: updatedProveedor.nombre,
        rif: updatedProveedor.rif,
        email: updatedProveedor.email,
        celular: updatedProveedor.celular,
        telefono: updatedProveedor.telefono,
        direccion: updatedProveedor.direccion,
        condiciones: updatedProveedor.condiciones,
        diasCredito: updatedProveedor.diasCredito,
        descuento: updatedProveedor.descuento,
        prontopago: updatedProveedor.prontopago,
        contacto: updatedProveedor.contacto,
      });
    }
  })
);

proveedorRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proveedor = await Proveedor.findById(req.params.id);
    if (proveedor) {
      const deleteProveedor = await proveedor.remove();
      res.send({
        message: 'Proveedor Eliminado',
        proveedor: deleteProveedor,
      });
    } else {
      res.status(404).send({ message: 'Proveedor No Encontrado' });
    }
  })
);

export default proveedorRouter;
