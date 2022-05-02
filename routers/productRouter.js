import express from 'express';
import expressAsyncHandler from 'express-async-handler';
//import dataStock from '../models/dataStock.js';
import Producto from '../models/producto.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const nombre = req.query.nombre || '';
    const categoria = req.query.categoria || '';
    const codigo = req.query.codigo || '';
    //const tags = req.query.tags || '';

    const nameFilter = nombre ? { nombre: { $regex: nombre, $options: 'i' } } : {};
    //const tagsFilter = tags ? { tags: { $regex: tags, $options: 'i' } } : {};
    const categoryFilter = categoria ? { categoria } : {};
    const codigoFilter = codigo ? { codigo: { $regex: codigo, $options: 'i' } } : {};
    console.log('nameFilter', nameFilter, 'codigoFilter', codigoFilter);

    const count = await Producto.countDocuments({
      ...nameFilter,
      ...codigoFilter,
    });

    const productos = await Producto.find({
      ...nameFilter,
      ...codigoFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({ productos, page, pages: Math.ceil(count / pageSize), count });
  })
);

productRouter.get(
  '/buscar',
  expressAsyncHandler(async (req, res) => {
    const codigo = req.query.codigo || '';
    //const codigoFinder = codigo ? { codigo: { $regex: codigo, $options: 'i' } } : {};
    const codigoFinder = codigo ? { codigo } : {};
    const producto = await Producto.find({
      ...codigoFinder,
    });
    console.log('codigo', codigo, 'Producto:', producto);
    res.send({ producto });
  })
);

productRouter.get(
  '/encontrar',
  expressAsyncHandler(async (req, res) => {
    console.log('ROUTER ENTRANDO', req.query);
    const codigo = req.query.codigo || '';
    const producto = await Producto.findOne({ codigo });
    console.log('PRODUCTO ENCONTRADO:', producto);
    if (producto) {
      res.send({
        productId: producto._id,
        codigo: codigo,
        nombre: producto.nombre,
        marca: producto.marca,
        descripcion: producto.descripcion,
      });
    } else {
      res.status(404).send({ message: 'Producto No encontrado' });
    }
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await Producto.deleteMany({});
    //const insertedProducts = await Producto.insertMany(dataStock.productos);
    //res.send(insertedProducts);
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    console.log('PRODUCTO ENCONTRADO:', producto);
    if (producto) {
      res.send(producto);
      console.log('producto con id', producto);
    } else {
      res.status(404).send({ message: 'Producto No encontrado' });
    }
  })
);

productRouter.post(
  '/create',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const producto = new Producto({
      codigo: req.body.codigo,
      ubicacion: req.body.ubicacion,
      nombre: req.body.nombre,
      marca: req.body.marca,
      presentacion: req.body.presentacion,
      unidades: req.body.unidades,
      vehiculo: req.body.vehiculo,
      modelos: req.body.modelos,
      years: req.body.years,
      motores: req.body.motores,
      tags: req.body.tags,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      existencia: req.body.existencia,
      reposicion: req.body.reposicion,
      costobs: req.body.costobs,
      costousd: req.body.costousd,
      preciobs: req.body.preciobs,
      preciousd: req.body.preciousd,
      proveedor: req.body.proveedor,
      imageurl: req.body.imageurl,
    });
    const createdProduct = await producto.save();
    console.log('createdProduct:', createdProduct);
    res.send({
      _id: createdProduct._id,
      codigo: createdProduct.codigo,
      ubicacion: createdProduct.ubicacion,
      nombre: createdProduct.nombre,
      marca: createdProduct.marca,
      presentacion: createdProduct.presentacion,
      unidades: createdProduct.unidades,
      vehiculo: createdProduct.vehiculo,
      modelos: createdProduct.modelos,
      years: createdProduct.years,
      motores: createdProduct.motores,
      tags: createdProduct.tags,
      categoria: createdProduct.categoria,
      descripcion: createdProduct.descripcion,
      existencia: createdProduct.existencia,
      reposicion: createdProduct.reposicion,
      costobs: createdProduct.costobs,
      costousd: createdProduct.costousd,
      preciobs: createdProduct.preciobs,
      preciousd: createdProduct.preciousd,
      proveedor: createdProduct.proveedor,
      imageurl: createdProduct.imageurl,
    });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const producto = await Producto.findById(productId);
    console.log('PUT REQ.BODY', req.body);
    if (producto) {
      producto.codigo = req.body.codigo;
      producto.ubicacion = req.body.ubicacion;
      producto.nombre = req.body.nombre;
      producto.marca = req.body.marca;
      producto.presentacion = req.body.presentacion;
      producto.unidades = req.body.unidades;
      producto.vehiculo = req.body.vehiculo;
      producto.modelos = req.body.modelos;
      producto.years = req.body.years;
      producto.motores = req.body.motores;
      producto.tags = req.body.tags;
      producto.categoria = req.body.categoria;
      producto.descripcion = req.body.descripcion;
      producto.existencia = req.body.existencia;
      producto.costobs = req.body.costobs;
      producto.costousd = req.body.costousd;
      producto.preciobs = req.body.preciobs;
      producto.preciousd = req.body.preciousd;
      producto.proveedor = req.body.proveedor;
      producto.imageurl = req.body.imageurl;

      const updatedProduct = await producto.save();
      res.send({ message: 'Producto Actualizado', producto: updatedProduct });
    } else {
      res.status(404).send({ message: 'Producto no Encontrado' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      const deleteProduct = await producto.remove();
      res.send({ message: 'Producto Eliminado', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Producto No Encontrado' });
    }
  })
);

productRouter.put(
  '/existencia/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log('req.params.id:', req.params.id);
    console.log('req.body', req.body);
    const productId = req.params.id;
    const producto = await Producto.findById(productId);

    if (producto) {
      if (req.body.movimiento === 'entrada') {
        const entrada = Number(producto.existencia) + Number(req.body.cantidad);
        producto.existencia = entrada;
      }
      if (req.body.movimiento === 'salida') {
        const salida = Number(producto.existencia) - Number(req.body.cantidad);
        producto.existencia = salida;
      }

      const updatedProduct = await producto.save();

      res.send({ message: 'Existencia Actualizada', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Producto No Encontrado' });
    }
  })
);

export default productRouter;
