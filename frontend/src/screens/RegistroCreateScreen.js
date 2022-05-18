import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { createRegistro } from '../actions/registroActions';
import LoadingBox from '../components/LoadingBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { REGISTRO_CREATE_RESET } from '../constants/registroConstants';
import { selectTipoDoc } from '../constants/selectsData';
import { format, parseISO } from 'date-fns';
import camaraimg from '../camara.png';

import { listProveedores } from '../actions/proveedorActions';

export default function RegistroCreateScreen(props) {
	const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [referencia, setReferencia] = useState('');
	const [beneficiario, setBeneficiario] = useState('');
	const [tipodoc, setTipodoc] = useState('Factura');
	const [categoria, setCategoria] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [montobs, setMontobs] = useState(0);
	const [montousd, setMontousd] = useState(0);
	const [cambio, setCambio] = useState(0);
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
				fecha,
				referencia,
				beneficiario,
				tipodoc,
				categoria,
				descripcion,
				montobs,
				montousd,
				cambio,
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
		setFecha(format(new Date(), 'yyyy-MM-dd'));
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
	];

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
							<div>
								<label htmlFor='fecha'>Fecha</label>
								<input
									id='fecha'
									type='date'
									value={fecha}
									required
									onChange={(e) => setFecha(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='beneficiario' id='label-beneficiario'>
									Beneficiario
								</label>
								<input
									id='beneficiario'
									type='text'
									placeholder='nombre'
									value={beneficiario}
									onChange={(e) => setBeneficiario(e.target.value)}
								></input>
							</div>

							<div>
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
						</div>

						<div className='row-container'>
							<div>
								<label htmlFor='montousd'>Monto US$</label>
								<input
									id='montousd'
									type='number'
									value={montousd}
									required
									onChange={(e) => getCosto(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='montobs'>Monto Bs.</label>
								<input
									id='montobs'
									type='number'
									value={montobs}
									required
									onChange={(e) => setMontobs(e.target.value)}
								></input>
							</div>

							<div>
								<label htmlFor='cambio'>cambio$</label>
								<input
									id='cambio'
									type='number'
									placeholder='cambio'
									value={cambio}
									onChange={(e) => setCambio(e.target.value)}
								></input>
							</div>
							<div>
								<label className='small-label'>Categoria</label>
								<select
									className='inline-select producto categoria'
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
							<div>
								<label className='small-label'>Tipo-Documento</label>
								<select
									className='inline-select producto'
									value={tipodoc}
									placeholder='selecionar'
									onChange={(e) => setTipodoc(e.target.value)}
								>
									{selectTipoDoc.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='row-container imagen'>
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
							<div>
								<label htmlFor='referencia' id='label-beneficiario'>
									Referencia
								</label>
								<input
									id='referencia'
									type='text'
									placeholder='referencia'
									value={referencia}
									onChange={(e) => setReferencia(e.target.value)}
								></input>
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
