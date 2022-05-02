import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Entrada from '../models/entrada.js';
import User from '../models/usuario.js';
import Product from '../models/producto.js';
import { isAdmin, isAuth } from '../utils.js';

const entradaRouter = express.Router();
entradaRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const entradas = await Entrada.find({}).populate('user', 'name');
    res.send(entradas);
  })
);

entradaRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const entradas = await Entrada.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyEntradas = await Entrada.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          entradas: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, entradas, dailyEntradas, productCategories });
  })
);

entradaRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const entradas = await Entrada.find({ user: req.user._id });
    res.send(entradas);
  })
);

entradaRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log('entrada items', req.bodyentradaItems);
    if (req.body.entradaItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const entrada = new Entrada({
        notaNumero: req.body.notaNumero,
        entradaItems: req.body.entradaItems,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        shippingPrice: req.body.shippingPrice,
        user: req.user._id,
        email: req.user.email,
        fechaMovimiento: req.body.fechaMovimiento,
        tipoMovimiento: req.body.tipoMovimiento,
        tipoDoc: req.body.tipoDoc,
        numeroDocumento: req.body.numeroDocumento,
        montoTotalUSD: req.body.montoTotalUSD,
        cambio: req.body.cambio,
        montoTotalBs: req.body.montoTotalBs,
        proveedor: req.body.proveedor,
      });
      const createdEntrada = await entrada.save();
      res.status(201).send({
        message: 'Se Ha Creado un Nuevo Pedido',
        entrada: createdEntrada,
      });
    }
  })
);

entradaRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const entrada = await Entrada.findById(req.params.id);
    if (entrada) {
      res.send(entrada);
    } else {
      res.status(404).send({ message: 'Entrada Not Found' });
    }
  })
);

entradaRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const entrada = await Entrada.findById(req.params.id);
    if (entrada) {
      const deleteEntrada = await entrada.remove();
      res.send({ message: 'Entrada Eliminada', entrada: deleteEntrada });
    } else {
      res.status(404).send({ message: 'Entrada Not Found' });
    }
  })
);

export default entradaRouter;
