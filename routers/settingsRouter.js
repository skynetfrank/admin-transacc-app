import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Settings from '../models/settings.js';
import { isAdmin, isAuth } from '../utils.js';

const settingsRouter = express.Router();

settingsRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const settings = await Settings.find({});
    res.send(settings);
  })
);

settingsRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const settings = await Settings.findById(req.params.id);
    if (settings) {
      res.send(settings);
    } else {
      res.status(404).send({ message: 'Seetings No Encontrado' });
    }
  })
);

settingsRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await Proveedor.remove({});

    const seedSettings = await Settings.insertMany({
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
      settings.cambioDiaAdmin = req.body.cambioDiaAdmin || settings.cambioDiaAdmin;
      const updatedsettings = await settings.save();
      res.send({
        _id: updatedsettings._id,
        cambioDiaAdmin: updatedsettings.cambioDiaAdmin,
      });
    }
  })
);

export default settingsRouter;
