import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { createProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import {
	customStyles,
	presentaciones,
	marcas,
	opciones,
	selectModelos,
	selectMotores,
	selectVehiculos,
	selectYears,
} from '../constants/selectsData';

import { listProveedores } from '../actions/proveedorActions';

export default function ProductCreateScreen(props) {
	const [codigo, setCodigo] = useState('');
	const [nombre, setNombre] = useState('');
	const [ubicacion, setUbicacion] = useState('');
	const [marca, setMarca] = useState('');
	const [presentacion, setPresentacion] = useState('');
	const [unidades, setUnidades] = useState(0);
	const [vehiculo, setVehiculo] = useState([]);
	const [modelos, setModelos] = useState([]);
	const [years, setYears] = useState([]);
	const [motores, setMotores] = useState([]);
	const [tags, setTags] = useState([]);
	const [categoria, setCategoria] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [existencia, setExistencia] = useState(0);
	const [reposicion, setReposicion] = useState(0);
	const [costobs, setCostobs] = useState(0);
	const [costousd, setCostousd] = useState('');
	const [preciobs, setPreciobs] = useState(0);
	const [preciousd, setPreciousd] = useState(0);
	const [proveedor, setProveedor] = useState('');
	const [imageurl, setImageurl] = useState(
		'https://res.cloudinary.com/lacimaimg/image/upload/v1648130326/productos/lacima_xpfgx9.jpg'
	);
	const [cambio, setCambio] = useState(1);
	const [loadingUpload, setLoadingUpload] = useState(false);
	const [errorUpload, setErrorUpload] = useState('');
	const [isRegister, setIsRegister] = useState(false);
	const [proveedores, setProveedores] = useState([]);

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const productCreate = useSelector((state) => state.productCreate);
	const { loading, error, success, product } = productCreate;

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

	useEffect(() => {
		const prov = async () => {
			try {
				const { data } = await Axios.get('/api/proveedores', {
					headers: {
						Authorization: `Bearer ${userInfo.token}`,
					},
				});

				let nombres = data.map((x) => x.nombre);
				console.log('data proveedores', nombres);
				nombres.unshift(' ');
				setProveedores(nombres);
			} catch (error) {
				console.log('Error al cargar proveedores', error);
			}
		};

		prov();
	}, []);

	useEffect(() => {
		let isCancelled = false;

		if (codigo === '') {
			return;
		}
		const buscarCode = async () => {
			try {
				const { data } = await Axios.get(
					`/api/productos/buscar?codigo=${codigo}`
				);

				if (data.producto.length > 0) {
					setIsRegister(true);
					toast.info('Codigo Ya registrado... Verifique!', {
						position: 'top-left',
						autoClose: 500,
						onClose: () => setCodigo(''),
					});
				}
				if (data.producto.length === 0) {
					setIsRegister(false);
				}
			} catch (error) {
				console.log('error al buscar codigo con axios', error);
			}
		};
		buscarCode();
		return () => {
			isCancelled = true;
		};
	}, [codigo, isRegister]);

	useEffect(() => {
		dispatch(listProveedores());
	}, [dispatch]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (isRegister) {
			toast.info('Codigo Ya registrado... Verifique!', {
				position: 'top-left',
				autoClose: 2000,
			});
			return;
		}

		dispatch(
			createProduct(
				codigo,
				nombre,
				ubicacion,
				marca,
				presentacion,
				unidades,
				vehiculo,
				modelos,
				years,
				motores,
				tags,
				categoria,
				descripcion,
				existencia,
				reposicion,
				costobs,
				costousd,
				preciobs,
				preciousd,
				proveedor,
				imageurl
			)
		);
	};

	useEffect(() => {
		if (product) {
			toast.success('Producto Registrado O.K.!', {
				position: 'top-center',
				autoClose: 2000,
			});
		}
		dispatch({ type: PRODUCT_CREATE_RESET });
		setCodigo('');
		setNombre('');
		setUbicacion('');
		setMarca('');
		setPresentacion('');
		setUnidades(1);
		setVehiculo([]);
		setModelos([]);
		setYears([]);
		setMotores([]);
		setTags([]);
		setCategoria('');
		setDescripcion('');
		setExistencia('');
		setReposicion('');
		setCostobs('');
		setCostousd('');
		setPreciobs('');
		setPreciousd('');
		setProveedor('');
		setImageurl(
			'https://res.cloudinary.com/lacimaimg/image/upload/v1648130326/productos/lacima_xpfgx9.jpg'
		);
	}, [dispatch, product]);
	/* 
  useEffect(() => {
    if (error) {
      toast.success('Error: Verifique el Codigo del Producto', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: PRODUCT_CREATE_RESET });
    }
  });
 */
	const uploadFileHandler = async (e) => {
		const image = e.target.files[0];

		const bodyFormData = new FormData();
		bodyFormData.append('file', image);
		bodyFormData.append('upload_preset', 'paulimg_preset');
		bodyFormData.append('cloud_name', 'paulimg');
		bodyFormData.append('folder', 'productos');
		setLoadingUpload(true);

		try {
			const { data } = await Axios.post(
				'https://api.cloudinary.com/v1_1/paulcloudimg/image/upload',
				bodyFormData
			);
			setImageurl(data.secure_url);
			setLoadingUpload(false);
		} catch (error) {
			setImageurl(
				'https://res.cloudinary.com/paulcloudimg/image/upload/v1651511605/registros/registro_gdryes.png'
			);
			setErrorUpload(error.message);
			setLoadingUpload(false);
		}
	};

	const getCosto = async (e) => {
		try {
			setCostobs((parseFloat(e) * parseFloat(cambio)).toFixed(2));
			setCostousd(e);
		} catch (error) {
			toast.error('Api Dolar Today No Disponible');
		}
	};

	const getPrecio = async (e) => {
		try {
			setPreciobs((parseFloat(e) * parseFloat(cambio)).toFixed(2));
			setPreciousd(e);
		} catch (error) {
			toast.error('Api Dolar Today No Disponible');
		}
	};

	const tagsChanges = (valor) => {
		setTags(valor);
	};

	const yearsChanges = (valor) => {
		setYears(valor);
	};
	const vehiculoChanges = (valor) => {
		setVehiculo(valor);
	};
	const motoresChanges = (valor) => {
		setMotores(valor);
	};
	const modelosChanges = (valor) => {
		setModelos(valor);
	};
	const selectCategorias = [
		' ',
		'Accesorios',
		'Aire Acondicionado y Calefacción',
		'Carrocería',
		'Gasolina',
		'Correa de Transmisión',
		'Dirección',
		'Eléctrico',
		'Encendido',
		'Freno y Rueda',
		'Limpiaparabrisas',
		'Lubricantes',
		'Motor',
		'Sistema de Enfriamiento',
		'Suspensión',
		'Transmisión-Automática',
		'Transmisión-Manual',
	];

	const clearCode = (e) => {
		e.preventDefault();
		setCodigo('');
	};

	return (
		<div className='wrapper'>
			<div className='titulo'>
				<h1>Producto Nuevo</h1>
				<Link to='/productlist' className='back-link producto'>
					volver a Productos
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
							<div className='div-codigo-outter'>
								<label htmlFor='codigo'>Codigo</label>
								<div className='div-codigo'>
									<input
										id='codigo'
										value={codigo}
										type='text'
										required
										onChange={(e) => setCodigo(e.target.value)}
									></input>
									<button className='btn-clear-codigo' onClick={clearCode}>
										&#9746;
									</button>
								</div>
							</div>

							<div>
								<label htmlFor='name'>Nombre</label>
								<input
									id='name'
									type='text'
									value={nombre}
									maxLength='50'
									required
									onChange={(e) => setNombre(e.target.value)}
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
								<label className='small-label'>Marca</label>
								<select
									className='inline-select producto'
									value={marca}
									placeholder='selecionar'
									onChange={(e) => setMarca(e.target.value)}
								>
									{marcas.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='small-label'>Presentacion</label>
								<select
									className='inline-select producto'
									value={presentacion}
									onChange={(e) => setPresentacion(e.target.value)}
								>
									{presentaciones.map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='small-label'>Unidades</label>
								<select
									className='inline-select producto'
									id='select-unidades'
									value={unidades}
									onChange={(e) => setUnidades(e.target.value)}
								>
									{[...Array(601).keys()].map((x) => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='row-container'>
							<div>
								<label htmlFor='costousd'>Costo US$</label>
								<input
									id='costousd'
									type='number'
									value={costousd}
									required
									onChange={(e) => getCosto(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='costobs'>Costo Bs.</label>
								<input
									id='costobs'
									type='number'
									value={costobs}
									required
									onChange={(e) => setCostobs(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='preciousd'>Precio US$</label>
								<input
									id='preciousd'
									type='number'
									value={preciousd}
									required
									onChange={(e) => getPrecio(e.target.value)}
								></input>
							</div>

							<div>
								<label htmlFor='preciobs'>Precio Bs.</label>
								<input
									id='preciobs'
									type='number'
									value={preciobs}
									required
									onChange={(e) => setPreciobs(e.target.value)}
								></input>
							</div>

							<div>
								<label htmlFor='existencia'>Existencia</label>
								<input
									id='existencia'
									type='number'
									value={existencia}
									required
									onChange={(e) => setExistencia(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='reposicion'>Reposicion</label>
								<input
									id='reposicion'
									type='number'
									value={reposicion}
									onChange={(e) => setReposicion(e.target.value)}
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

						<div className='row-container selectores'>
							<div className='multiselect'>
								<label className='legacy'>MARCA</label>
								<Select
									id='select3'
									options={selectVehiculos}
									value={vehiculo}
									styles={customStyles}
									isMulti
									noOptionsMessage={() => 'No existe esa opcion en la lista'}
									isSearchable
									placeholder='selecionar'
									onChange={vehiculoChanges}
								/>
							</div>
							<div className='multiselect'>
								<label className='legacy'>MODELO</label>
								<Select
									id='select5'
									options={selectModelos}
									value={modelos}
									styles={customStyles}
									noOptionsMessage={() => 'No existe esa opcion en la lista'}
									isMulti
									isSearchable
									placeholder='selecionar'
									onChange={modelosChanges}
								/>
							</div>
							<div className='multiselect'>
								<label className='legacy'>MOTOR</label>
								<Select
									id='select4'
									options={selectMotores}
									value={motores}
									styles={customStyles}
									isMulti
									placeholder='selecionar'
									onChange={motoresChanges}
								/>
							</div>
						</div>
						<div className='row-container selectores'>
							<div className='multiselect'>
								<label className='legacy'>AÑO</label>
								<Select
									id='select2'
									options={selectYears}
									value={years}
									styles={customStyles}
									noOptionsMessage={() => 'No existe esa opcion en la lista'}
									isMulti
									isSearchable
									placeholder='selecionar'
									onChange={yearsChanges}
								/>
							</div>
							<div className='multiselect'>
								<label className='legacy'>SIGLAS</label>
								<Select
									id='select1'
									options={opciones}
									value={tags}
									styles={customStyles}
									noOptionsMessage={() => 'No existe esa opcion en la lista'}
									isMulti
									isSearchable
									placeholder='Seleccionar Siglas'
									onChange={tagsChanges}
								/>
							</div>

							<div>
								<div>
									<label htmlFor='ubicacion'>Ubicacion</label>
									<input
										id='ubicacion'
										type='text'
										pattern='[]|[X][0-9]|[E][0-9][P][0-9][-][0-9]'
										placeholder='ejemplo: E1P1-5'
										required
										value={ubicacion}
										onChange={(e) => setUbicacion(e.target.value)}
									></input>
								</div>
								<div>
									<label className='small-label'>Proveedor</label>
									<select
										className='inline-select producto'
										id='select-proveedor'
										value={proveedor}
										onChange={(e) => setProveedor(e.target.value)}
									>
										{proveedores.map((x) => (
											<option key={x} value={x}>
												{x}
											</option>
										))}
									</select>
								</div>
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
								<div>
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
								Guardar Nuevo Producto
							</button>
						</div>
					</React.Fragment>
				}
			</form>
		</div>
	);
}
