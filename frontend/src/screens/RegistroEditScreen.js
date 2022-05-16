import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import {
	detailsRegistro,
	listRegistros,
	updateRegistro,
} from '../actions/registroActions';
import LoadingBox from '../components/LoadingBox';
import { REGISTRO_UPDATE_RESET } from '../constants/registroConstants';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectTipoDoc } from '../constants/selectsData';

export default function RegistroEditScreen(props) {
	const params = useParams();
	const navigate = useNavigate();
	const { id: registroId } = params;

	const [fecha, setFecha] = useState('');
	const [referencia, setReferencia] = useState('');
	const [tipooperacion, setTipooperacion] = useState('egreso');
	const [tipodoc, setTipodoc] = useState('Factura');
	const [categoria, setCategoria] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [montobs, setMontobs] = useState(0);
	const [montousd, setMontousd] = useState(0);
	const [cambio, setCambio] = useState(0);
	const [imageurl, setImageurl] = useState(
		'https://res.cloudinary.com/demodapagos/image/upload/v1651855004/pagos/pagosimg_z4whqb.jpg'
	);

	const registroDetails = useSelector((state) => state.registroDetails);
	const { loading, error, registro } = registroDetails;
	console.log('registro:', registro);

	const registroUpdate = useSelector((state) => state.registroUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = registroUpdate;

	const dispatch = useDispatch();

	useEffect(() => {
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
	}, []);

	useEffect(() => {
		if (successUpdate) {
			toast.success('Informacion Actualizada ok', {
				position: 'top-center',
				autoClose: 1500,
			});
			navigate('/registrolist');
		}
		if (!registro || registro._id !== registroId || successUpdate) {
			dispatch({ type: REGISTRO_UPDATE_RESET });
			dispatch(detailsRegistro(registroId));
		} else {
			setFecha(registro.fecha || ' ');
			setReferencia(registro.referencia || ' ');
			setTipooperacion(registro.tipooperacion || ' ');
			setTipodoc(registro.tipodoc || ' ');
			setCategoria(registro.categoria || ' ');
			setDescripcion(registro.descripcion || ' ');
			setMontobs(registro.montobs || ' ');
			setMontousd(registro.montousd || ' ');
			setCambio(registro.cambio || ' ');
			setImageurl(registro.imageurl || ' ');
		}
	}, [dispatch, successUpdate, navigate, registro, registroId]);

	const submitHandler = (e) => {
		e.preventDefault();

		dispatch(
			updateRegistro({
				_id: registroId,
				fecha,
				referencia,
				tipooperacion,
				tipodoc,
				categoria,
				descripcion,
				montobs,
				montousd,
				cambio,
				imageurl,
			})
		);
	};
	const [loadingUpload, setLoadingUpload] = useState(false);
	const [errorUpload, setErrorUpload] = useState('');

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

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
			setImageurl(data.url);
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

	useEffect(() => {
		if (error) {
			dispatch({ type: REGISTRO_UPDATE_RESET });
		}
	});

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
	];

	return (
		<div className='wrapper'>
			<div className='titulo'>
				<h1>Registrar Egreso</h1>
				<Link to='/registrolist' className='back-link producto'>
					volver a Registros
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
								<label htmlFor='descripcion'>Descripcion</label>
								<textarea
									id='descripcion'
									rows='1'
									type='text'
									maxLength='100'
									required
									placeholder='breve descripcion del producto'
									value={descripcion}
									onChange={(e) => setDescripcion(e.target.value)}
								></textarea>
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
						</div>

						<div className='row-container imagen'>
							<div id='div-tiny-image'>
								<img src={imageurl} className='tiny-image' alt=' imagen' />
							</div>
							<div className='grupo-imagen'>
								<div>
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
								<div className='hidden'>
									<input
										id='imageurl'
										className='cloudinary-url-input'
										type='text'
										value={imageurl}
										onChange={(e) => setImageurl(e.target.value)}
										disabled
									></input>
								</div>
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
