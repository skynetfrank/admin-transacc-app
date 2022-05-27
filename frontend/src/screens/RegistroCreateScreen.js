import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { createRegistro } from '../actions/registroActions';
import LoadingBox from '../components/LoadingBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { REGISTRO_CREATE_RESET } from '../constants/registroConstants';
import { selectTipoDoc, selectTipoReg } from '../constants/selectsData';
import { format, parseISO } from 'date-fns';
import camaraimg from '../camara.png';

import { listProveedores } from '../actions/proveedorActions';

export default function RegistroCreateScreen(props) {
	const [fecharegistro, setFecharegistro] = useState(
		format(new Date(), 'yyyy-MM-dd')
	);
	const [fechapago, setFechapago] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [referencia, setReferencia] = useState('');
	const [beneficiario, setBeneficiario] = useState('');
	const [tipodoc, setTipodoc] = useState('');
	const [tiporegistro, setTiporegistro] = useState('');
	const [categoria, setCategoria] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [montobs, setMontobs] = useState(0);
	const [montousd, setMontousd] = useState(0);
	const [cambio, setCambio] = useState(0);
	const [nota, setNota] = useState('');
	const [status, setStatus] = useState('');
	const [imageurl, setImageurl] = useState(
		'https://res.cloudinary.com/demodapagos/image/upload/v1651855004/pagos/pagosimg_z4whqb.jpg'
	);

	const [loadingUpload, setLoadingUpload] = useState(false);
	const [errorUpload, setErrorUpload] = useState('');

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const registroCreate = useSelector((state) => state.registroCreate);
	const { loading, error, success, registro } = registroCreate;

	const dispatch = useDispatch();

	useEffect(() => {
		let isCancelled = false;
		const fetchCambio = async () => {
			try {
				const { data } = await Axios.get(
					'https://s3.amazonaws.com/dolartoday/data.json'
				);
				setCambio(data.USD.sicad2);
			} catch (error) {
				toast.error('Api Dolar Today No Disponible');
			}
		};
		fetchCambio();
		return () => {
			isCancelled = true;
		};
	}, []);

	const submitHandler = (e) => {
		e.preventDefault();

		dispatch(
			createRegistro(
				fecharegistro,
				fechapago,
				referencia,
				beneficiario,
				tipodoc,
				tiporegistro,
				categoria,
				descripcion,
				montobs,
				montousd,
				cambio,
				nota,
				status,
				imageurl
			)
		);
	};

	useEffect(() => {
		if (registro) {
			toast.success('Egreso Registrado O.K.!', {
				position: 'top-center',
				autoClose: 1000,
			});
		}
		dispatch({ type: REGISTRO_CREATE_RESET });
		setFecharegistro(format(new Date(), 'yyyy-MM-dd'));
		setFechapago('');
		setTiporegistro('');
		setReferencia('');
		setBeneficiario('');
		setCategoria('');
		setDescripcion('');
		setMontobs('');
		setMontousd('');
		setCambio('');
		setImageurl(camaraimg);
	}, [dispatch, registro]);

	const uploadFileHandler = async (e) => {
		const image = e.target.files[0];

		const bodyFormData = new FormData();
		bodyFormData.append('file', image);
		bodyFormData.append('upload_preset', 'demodapagos_preset');
		bodyFormData.append('cloud_name', 'demodapagos');
		bodyFormData.append('folder', 'pagos');
		setLoadingUpload(true);

		try {
			const { data } = await Axios.post(
				'https://api.cloudinary.com/v1_1/demodapagos/image/upload',
				bodyFormData
			);
			setImageurl(data.secure_url);
			setLoadingUpload(false);
		} catch (error) {
			setImageurl(
				'https://res.cloudinary.com/demodapagos/image/upload/v1651855004/pagos/pagosimg_z4whqb.jpg'
			);
			setErrorUpload(error.message);
			setLoadingUpload(false);
		}
	};

	const getCosto = async (e) => {
		try {
			setMontobs((parseFloat(e) * parseFloat(cambio)).toFixed(2));
			setMontousd(e);
		} catch (error) {
			toast.error('Api Dolar Today No Disponible');
		}
	};

	const selectCategorias = [
		' ',
		'Tasas y Tributos',
		'Remodelacion',
		'Suministros',
		'Consumibles',
		'Materiales',
		'Tramites Varios',
		'Sueldos',
		'Equipos',
		'Constitucion',
		'Relaciones Publicas',
		'Transporte',
		'Mantenimiento',
		'Repuestos',
		'Servicios',
		'Otros',
	];
	const selectStatus = [' ', 'Pagado', 'Pendiente', 'Anticipo'];

	return (
		<div className='wrapper'>
			<div className='titulo'>
				<h1>Registrar Egreso</h1>
				<Link to='/registrolist' className='back-link'>
					Listado
				</Link>
			</div>
			<form
				className='form producto'
				id='form-producto'
				onSubmit={submitHandler}
			>
				{
					<React.Fragment key={99}>
						<div className='row-container'>
							<div className='input-container'>
								<label htmlFor='fecha'>Fecha</label>
								<input
									id='fecha'
									type='date'
									value={fecharegistro}
									required
									onChange={(e) => setFecharegistro(e.target.value)}
								></input>
							</div>
							<div className='select-container'>
								<label className='small-label'>Tipo-Registro</label>
								<select
									className='select-small'
									value={tiporegistro}
									required
									placeholder='seleccionar'
									onChange={(e) => setTiporegistro(e.target.value)}
								>
									{selectTipoReg.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
							<div className='select-container'>
								<label className='small-label'>Tipo-Documento</label>
								<select
									className='select-medium'
									required
									value={tipodoc}
									placeholder='seleccionar'
									onChange={(e) => setTipodoc(e.target.value)}
								>
									{selectTipoDoc.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
							<div className='select-container'>
								<label className='small-label'>Categoria</label>
								<select
									className='select-large'
									required
									value={categoria}
									onChange={(e) => setCategoria(e.target.value)}
								>
									{selectCategorias.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
							<div className='input-container'>
								<label htmlFor='beneficiario'>Beneficiario</label>
								<input
									id='beneficiario'
									type='text'
									placeholder='nombre'
									value={beneficiario}
									required
									onChange={(e) => setBeneficiario(e.target.value)}
								></input>
							</div>
						</div>

						<div className='row-container'>
							<div className='input-container'>
								<label htmlFor='descripcion'>Descripcion</label>
								<textarea
									id='descripcion'
									rows='1'
									type='text'
									maxLength='100'
									required
									value={descripcion}
									onChange={(e) => setDescripcion(e.target.value)}
								></textarea>
							</div>
							<div className='input-container'>
								<label htmlFor='referencia'>Referencia</label>
								<input
									type='text'
									required
									placeholder='referencia'
									value={referencia}
									onChange={(e) => setReferencia(e.target.value)}
								></input>
							</div>
							<div className='input-container'>
								<label htmlFor='montousd'>Monto US$</label>
								<input
									id='montousd'
									type='number'
									value={montousd}
									required
									onChange={(e) => getCosto(e.target.value)}
								></input>
							</div>
							<div className='input-container'>
								<label htmlFor='montobs'>Monto Bs.</label>
								<input
									id='montobs'
									type='number'
									value={montobs}
									onChange={(e) => setMontobs(e.target.value)}
								></input>
							</div>

							<div className='input-container'>
								<label htmlFor='cambio'>cambio$</label>
								<input
									id='cambio'
									type='number'
									placeholder='cambio'
									value={cambio}
									onChange={(e) => setCambio(e.target.value)}
								></input>
							</div>
						</div>

						<div className='row-container imagen'>
							<div className='select-container'>
								<label className='small-label'>Status</label>
								<select
									className='select-small'
									value={status}
									required
									placeholder='seleccionar'
									onChange={(e) => setStatus(e.target.value)}
								>
									{selectStatus.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
							<div className='input-container'>
								<label htmlFor='fecha'>Fecha de Pago</label>
								<input
									id='fechapago'
									type='date'
									value={fechapago}
									onChange={(e) => setFechapago(e.target.value)}
								></input>
							</div>
							<div className='input-container'>
								<label htmlFor='nota'>Nota</label>
								<input
									id='nota'
									type='text'
									placeholder='nota'
									value={nota}
									onChange={(e) => setNota(e.target.value)}
								></input>
							</div>
							<div className='grupo-imagen'>
								<img src={imageurl} className='tiny-image' alt=' imagen' />
								<input
									type='file'
									className='custom-file-input'
									id='imageFile'
									onChange={uploadFileHandler}
								></input>
								{loadingUpload && <LoadingBox></LoadingBox>}
								{errorUpload &&
									toast.error('No se puede subir Imagen', {
										position: 'bottom-right',
										autoClose: 1000,
									})}
							</div>
						</div>

						<div>
							<button className='primary' type='submit'>
								Guardar Registro
							</button>
						</div>
					</React.Fragment>
				}
			</form>
		</div>
	);
}
