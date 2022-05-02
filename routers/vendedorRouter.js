import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Vendedor from '../models/vendedor.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const vendedorRouter = express.Router();

vendedorRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const vendedor = await Vendedor.findOne({ email: req.body.email });
    if (vendedor) {
      if (bcrypt.compareSync(req.body.password, vendedor.password)) {
        res.send({
          _id: vendedor._id,
          nombre: vendedor.nombre,
          apellido: vendedor.apellido,
          cedula: vendedor.cedula,
          fechaNacimiento: vendedor.fechaNacimiento,
          fechaInicio: vendedor.fechaInicio,
          fechaRetiro: vendedor.fechaRetiro,
          sueldoMensual: vendedor.sueldoMensual,
          email: vendedor.email,
          password: vendedor.password,
          telefono: vendedor.telefono,
          comision: vendedor.comision,
          acumuladoVentas: vendedor.acumuladoVentas,
          observaciones: vendedor.observaciones,
          isSeller: vendedor.isSeller,
          token: generateToken(vendedor),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email o Clave Invalidos' });
  })
);

vendedorRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const vendedor = new vendedor({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      cedula: req.body.cedula,
      fechaNacimiento: req.body.fechaNacimien,
      fechaRetiro: req.body.fechaRetiro,
      sueldoMensual: req.body.sueldoMensual,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      telefono: req.body.telefono,
      comision: req.body.comision,
      acumuladoVentas: req.body.acumuladoVentas,
      observaciones: req.body.observaciones,
    });
    const createdvendedor = await vendedor.save();
    res.send({
      _id: createdvendedor._id,
      nombre: createdvendedor.nombre,
      apellido: createdvendedor.apellido,
      cedula: createdvendedor.cedula,
      fechaNacimiento: createdvendedor.fechaNacimien,
      fechaRetiro: createdvendedor.fechaRetiro,
      sueldoMensual: createdvendedor.sueldoMensual,
      email: createdvendedor.email,
      telefono: createdvendedor.telefono,
      comision: createdvendedor.comision,
      acumuladoVentas: createdvendedor.acumuladoVentas,
      observaciones: createdvendedor.observaciones,
      isAdmin: createdvendedor.isAdmin,
      token: generateToken(createdvendedor),
    });
  })
);

vendedorRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const vendedor = await vendedor.findById(req.params.id);
    if (vendedor) {
      res.send(vendedor);
    } else {
      res.status(404).send({ message: 'Vendedor No Encontrado' });
    }
  })
);

vendedorRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const vendedor = await vendedor.findById(req.vendedor._id);
    if (vendedor) {
      vendedor.nombre = req.body.nombre || vendedor.nombre;
      vendedor.apellido = req.body.apellido || vendedor.apellido;
      vendedor.cedula = req.body.cedula || vendedor.cedula;
      vendedor.fechaNacimiento = req.body.fechaNacimiento || vendedor.fechaNacimiento;
      vendedor.fechaRetiro = req.body.fechaRetiro || vendedor.fechaRetiro;
      vendedor.sueldoMensual = req.body.sueldoMensual || vendedor.sueldoMensual;
      vendedor.email = req.body.email || vendedor.email;
      vendedor.telefono = req.body.telefono || vendedor.telefono;
      vendedor.comision = req.body.comision || vendedor.comision;
      vendedor.acumuladoVentas = req.body.acumuladoVentas || vendedor.acumuladoVentas;
      vendedor.observaciones = req.body.observaciones || vendedor.observaciones;

      if (req.body.password) {
        vendedor.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedvendedor = await vendedor.save();
      res.send({
        _id: updatedvendedor._id,
        nombre: updatedvendedor.nombre,
        apellido: updatedvendedor.apellido,
        cedula: updatedvendedor.cedula,
        fechaNacimiento: updatedvendedor.fechaNacimiento,
        fecharetiro: updatedvendedor.fechaRetiro,
        sueldoMensual: updatedvendedor.sueldoMensual,
        email: updatedvendedor.email,
        telefono: updatedvendedor.telefono,
        comision: updatedvendedor.comision,
        acumuladoVentas: updatedvendedor.acumuladoVentas,
        observaciones: updatedvendedor.observaciones,
        isAdmin: updatedvendedor.isAdmin,
        token: generateToken(updatedvendedor),
      });
    }
  })
);

vendedorRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const vendedores = await Vendedor.find({});
    res.send(vendedores);
  })
);

vendedorRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const vendedor = await Vendedor.findById(req.params.id);
    if (vendedor) {
      if (vendedor.email === 'frank.uah@gmail.com') {
        res.status(400).send({ message: 'No puedes Eliminar al Admin-Developer!' });
        return;
      }
      const deletevendedor = await vendedor.remove();
      res.send({ message: 'Vendedor Eliminado', vendedor: deletevendedor });
    } else {
      res.status(404).send({ message: 'Vendedor No Encontrado' });
    }
  })
);

vendedorRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const vendedor = await Vendedor.findById(req.params.id);
    if (vendedor) {
      vendedor.nombre = req.body.nombre || vendedor.nombre;
      vendedor.email = req.body.email || vendedor.email;
      vendedor.isAdmin = Boolean(req.body.isAdmin);

      const updatedvendedor = await vendedor.save();
      res.send({ message: 'Vendedor Actualizado', vendedor: updatedvendedor });
    } else {
      res.status(404).send({ message: 'Vendedor No Encontrado' });
    }
  })
);

export default vendedorRouter;
