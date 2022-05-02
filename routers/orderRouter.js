import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/pedido.js';
import User from '../models/usuario.js';
import Product from '../models/producto.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter = express.Router();
orderRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Order.countDocuments({});
    const orders = await Order.find({});
    res.send({ orders, page, pages: Math.ceil(count / pageSize) });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
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
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
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
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        clienteInfo: req.body.clienteInfo,
        vendedorInfo: req.body.vendedorInfo,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        isVendedor: req.body.isVendedor,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
        email: req.user.email,
        cambioDia: req.body.cambioDia,
      });
      const createdOrder = await order.save();
      res.status(201).send({ message: 'Se Ha Creado un Nuevo Pedido', order: createdOrder });
    }
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      console.log('req.body.refzelle', req.body.refzelle);
      console.log('req.body.montotransfer', req.body.montotransfer);
      order.paymentResult = {
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
        montozelle: req.body.montozelle,
        montopagomobil: req.body.montopagomobil,
        monedas: req.body.monedas,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Pedido Pagado', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Pedido No Encontrado' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Pedido Eliminado', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Pedido No Encontrado' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: 'Pedido Entregado', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Pedido No Encontrado' });
    }
  })
);

orderRouter.put(
  '/:id/payconfirm',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const usuario = req.query.usuario;
    console.log('CONFIRMADOR:', usuario);
    const order = await Order.findById(req.params.id);
    if (order) {
      order.paymentResult.status = 'CONFIRMADO';
      order.paymentResult.confirmador = usuario;
      const updatedOrder = await order.save();
      res.send({
        message: 'Transferencia Bancaria Confirmada OK!',
        order: updatedOrder,
      });
    } else {
      res.status(404).send({ message: 'Orden No Encontrada' });
    }
  })
);

export default orderRouter;
