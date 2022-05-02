import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Cliente from '../models/cliente.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const clienteRouter = express.Router();

//Registrar Empresas Clientes
clienteRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const cliente = new Cliente({
      nombre: req.body.nombre,
      email: req.body.email,
      rif: req.body.rif,
      direccion: req.body.direccion,
      celular: req.body.celular,
      telefono: req.body.telefono,
      isTaller: req.body.isTaller,
      condiciones: req.body.condiciones,
      prontopago: req.body.prontopago,
      descuento: req.body.descuento,
      contacto: req.body.contacto,
    });
    const createdCliente = await cliente.save();

    res.send({
      _id: createdCliente._id,
      nombre: createdCliente.nombre,
      email: createdCliente.email,
      rif: createdCliente.rif,
      direccion: createdCliente.direccion,
      celular: createdCliente.celular,
      telefono: createdCliente.telefono,
      isTaller: createdCliente.isTaller,
      condiciones: createdCliente.condiciones,
      prontopago: createdCliente.prontopago,
      descuento: createdCliente.descuento,
      contacto: createdCliente.contacto,
    });
  })
);

clienteRouter.get(
  '/byrif',
  expressAsyncHandler(async (req, res) => {
    console.log('ROUTER ENTRANDO', req.query);
    const rif = req.query.rif || '';
    const cliente = await Cliente.findOne({ rif });
    console.log('CLIENTE ENCONTRADO:', cliente);
    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: 'Cliente No encontrado' });
    }
  })
);

clienteRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: 'Cliente No Existe' });
    }
  })
);

clienteRouter.get(
  '/byrif',
  expressAsyncHandler(async (req, res) => {
    console.log('ROUTER ENTRANDO', req.query);
    const rif = req.query.rif || '';
    const cliente = await Cliente.findOne({ rif });
    console.log('CLIENTE ENCONTRADO:', cliente);
    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: 'Cliente No encontrado' });
    }
  })
);

clienteRouter.put(
  '/profile',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.body._id);
    if (cliente) {
      cliente.nombre = req.body.nombre || cliente.nombre;
      cliente.rif = req.body.rif || cliente.rif;
      cliente.email = req.body.email || cliente.email;
      cliente.celular = req.body.celular || cliente.celular;
      cliente.telefono = req.body.telefono || cliente.telefono;
      cliente.direccion = req.body.direccion || cliente.direccion;
      cliente.isTaller = req.body.isTaller || cliente.isTaller;
      cliente.condiciones = req.body.condiciones || cliente.condiciones;
      cliente.descuento = req.body.descuento || cliente.descuento;
      cliente.prontopago = req.body.prontopago || cliente.prontopago;
      cliente.contacto = req.body.contacto || cliente.contacto;

      const updatedCliente = await cliente.save();
      res.send({
        _id: updatedCliente._id,
        nombre: updatedCliente.nombre,
        rif: updatedCliente.rif,
        email: updatedCliente.email,
        celular: updatedCliente.celular,
        telefono: updatedCliente.telefono,
        direccion: updatedCliente.direccion,
        isTaller: updatedCliente.isTaller,
        condiciones: updatedCliente.condiciones,
        descuento: updatedCliente.descuento,
        prontopago: updatedCliente.prontopago,
        contacto: updatedCliente.contacto,
      });
    }
  })
);

clienteRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const clientes = await Cliente.find({});
    res.send(clientes);
  })
);

clienteRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      const deleteCliente = await cliente.remove();
      res.send({
        message: 'Cliente Eliminado',
        cliente: deleteCliente,
      });
    } else {
      res.status(404).send({ message: 'Cliente No Encontrado' });
    }
  })
);

export default clienteRouter;
