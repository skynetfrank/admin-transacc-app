import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Cotizacion from '../models/cotizacion.js';
import User from '../models/usuario.js';
import Product from '../models/producto.js';
import { isAdmin, isAuth } from '../utils.js';

const cotizacionRouter = express.Router();
cotizacionRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Cotizacion.countDocuments({});
    const cotizaciones = await Cotizacion.find({});
    res.send({ cotizaciones, page, pages: Math.ceil(count / pageSize) });
  })
);

cotizacionRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cotizaciones = await Cotizacion.aggregate([
      {
        $group: {
          _id: null,
          numCotizaciones: { $sum: 1 },
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
    const dailyCotizaciones = await Cotizacion.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          cotizaciones: { $sum: 1 },
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
    res.send({ users, cotizaciones, dailyCotizaciones, productCategories });
  })
);

cotizacionRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cotizaciones = await Cotizacion.find({ user: req.user._id });
    res.send(cotizaciones);
  })
);

cotizacionRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log('req.body cotizaciones:', req.body);
    if (req.body.cotizacionItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const cotizacion = new Cotizacion({
        cotizacionItems: req.body.cotizacionItems,
        clienteInfo: req.body.clienteInfo,
        vendedorInfo: req.body.vendedorInfo,
        shippingAddress: req.body.shippingAddress,
        isVendedor: req.body.isVendedor,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
        email: req.user.email,
        cambioDia: req.body.cambioDia,
      });
      const createdCotizacion = await cotizacion.save();
      res.status(201).send({
        message: 'Se Ha Creado un Nuevo Pedido',
        cotizacion: createdCotizacion,
      });
    }
  })
);

cotizacionRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (cotizacion) {
      res.send(cotizacion);
    } else {
      res.status(404).send({ message: 'Cotizacion Not Found' });
    }
  })
);

cotizacionRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cotizacion = await Cotizacion.findById(req.params.id).populate('user', 'email name');
    if (cotizacion) {
      cotizacion.isPaid = true;
      cotizacion.paidAt = Date.now();
      console.log('req.body.refzelle', req.body.refzelle);
      console.log('req.body.montotransfer', req.body.montotransfer);
      cotizacion.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
        banco: req.body.banco,
        referencia: req.body.referencia,
        fechaTransferencia: req.body.fechaTransferencia,
        refzelle: req.body.refzelle,
        cuentazelle: req.body.cuentazelle,
        refpagomobil: req.body.refpagomobil,
        refpagomixto: req.body.refpagomixto,
        refpagoefectivo: req.body.refpagoefectivo,
        montotransfer: req.body.montotransfer,
      };
      const updatedCotizacion = await cotizacion.save();
      res.send({ message: 'Pedido Pagado', cotizacion: updatedCotizacion });
    } else {
      res.status(404).send({ message: 'Pedido No Encontrado' });
    }
  })
);

cotizacionRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (cotizacion) {
      const deleteCotizacion = await cotizacion.remove();
      res.send({ message: 'Pedido Eliminado', cotizacion: deleteCotizacion });
    } else {
      res.status(404).send({ message: 'Pedido No Encontrado' });
    }
  })
);

cotizacionRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (cotizacion) {
      cotizacion.isDelivered = true;
      cotizacion.deliveredAt = Date.now();
      const updatedCotizacion = await cotizacion.save();
      res.send({ message: 'Pedido Entregado', cotizacion: updatedCotizacion });
    } else {
      res.status(404).send({ message: 'Pedido No Encontrado' });
    }
  })
);

cotizacionRouter.put(
  '/:id/payconfirm',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const usuario = req.query.usuario;
    console.log('CONFIRMADOR:', usuario);
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (cotizacion) {
      cotizacion.paymentResult.status = 'CONFIRMADO';
      cotizacion.paymentResult.confirmador = usuario;
      const updatedCotizacion = await cotizacion.save();
      res.send({
        message: 'Transferencia Bancaria Confirmada OK!',
        cotizacion: updatedCotizacion,
      });
    } else {
      res.status(404).send({ message: 'Orden No Encontrada' });
    }
  })
);

export default cotizacionRouter;
