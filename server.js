import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import productRouter from './routers/productRouter.js';
import registroRouter from './routers/registroRouter.js';
import proveedorRouter from './routers/proveedorRouter.js';
import userRouter from './routers/userRouter.js';
import vendedorRouter from './routers/vendedorRouter.js';
import orderRouter from './routers/orderRouter.js';
import cotizacionRouter from './routers/cotizacionRouter.js';
import clienteRouter from './routers/clienteRouter.js';
import entradaRouter from './routers/entradaRouter.js';
import settingsRouter from './routers/settingsRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const localdb = 'mongodb://localhost/lacimadb';
//process.env.MONGODB_URI;
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('mongodb =>: conectado'))
	.catch((e) => console.log(e.message));

app.use('/api/users', userRouter);
app.use('/api/productos', productRouter);
app.use('/api/registros', registroRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cotizaciones', cotizacionRouter);
app.use('/api/vendedores', vendedorRouter);
app.use('/api/clientes', clienteRouter);
app.use('/api/proveedores', proveedorRouter);
app.use('/api/entradas', entradaRouter);
app.use('/api/settings', settingsRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
	res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
	res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('servidor ok escuchando en http://localhost');
});
