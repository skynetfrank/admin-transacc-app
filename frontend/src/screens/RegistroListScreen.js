import {
	faPencilAlt,
	faSearch,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { deleteRegistro, listRegistros } from '../actions/registroActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { REGISTRO_DELETE_RESET } from '../constants/registroConstants';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../components/Tooltip';

export default function RegistroListScreen(props) {
	const navigate = useNavigate();
	const { pageNumber = 1 } = useParams();
	const [group, setGroup] = useState([...Array(5).keys()]);
	const [palabra, setPalabra] = useState('');
	const [busqueda, setBusqueda] = useState('');
	const [escodigo, setEscodigo] = useState('');

	const { pathname } = useLocation();
	const sellerMode = pathname.indexOf('/seller') >= 0;

	const registroList = useSelector((state) => state.registroList);
	const { loading, error, registros, page, pages } = registroList;

	const registroDelete = useSelector((state) => state.registroDelete);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = registroDelete;
	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const dispatch = useDispatch();

	useEffect(() => {
		if (busqueda === '') {
			dispatch(listRegistros({ nombre: '', pageNumber: pageNumber }));
		} else {
			dispatch(listRegistros({ nombre: busqueda, pageNumber: pageNumber }));
		}
	}, [busqueda, dispatch, escodigo, pageNumber]);

	const busquedaHandler = () => {
		const firstLetter = palabra.charAt(0);
		setEscodigo(firstLetter);
		setBusqueda(palabra);
	};

	const palabraHandler = (e) => {
		setPalabra(e.target.value);
	};

	const clearSearch = () => {
		setBusqueda('');
		setPalabra('');
		navigate('/registrolist');
	};

	useEffect(() => {
		if (successDelete) {
			dispatch({ type: REGISTRO_DELETE_RESET });
		}
		dispatch(listRegistros({ pageNumber }));
	}, [dispatch, navigate, successDelete, pageNumber]);

	const deleteHandler = (registro) => {
		if (window.confirm('Esta Seguro de Eliminar Este Producto?')) {
			dispatch(deleteRegistro(registro._id));
		}
	};

	const previousPages = () => {
		const actualRange = Math.min(...group) - 1;
		if (actualRange <= 0) {
			return;
		}
		const previousRange = range(actualRange - 4, actualRange, 1);
		setGroup(previousRange);
	};

	const nextPages = () => {
		const previousRange = Math.max(...group) + 1;
		if (previousRange >= pages) {
			return;
		}

		const nextRange = range(previousRange, previousRange + 4, 1);
		setGroup(nextRange);
	};

	const firstPage = () => {
		const firstRange = range(0, 4, 1);
		setGroup(firstRange);
		// navigate('/pageNumber/1');
	};

	const lastPage = () => {
		const residuo = pages % 5;
		const lastRange = range(pages - residuo, pages + residuo, 1);
		setGroup(lastRange);
		// navigate(`/pageNumber/${pages}`);
	};

	const range = (start, stop, step) =>
		Array.from(
			{ length: (stop - start) / step + 1 },
			(_, i) => start + i * step
		);

	const mostrarValor = (valor) => {
		const items = valor.map((v) => v.value + ' ');
		return items;
	};
	console.log('registros', registros, 'loading', loading, 'error', error);
	return (
		<div>
			<div className='row'>
				<h1>Egresos</h1>
				<div className='search-div'>
					<input
						type='text'
						value={palabra}
						className='search-input'
						placeholder='buscar...'
						onChange={palabraHandler}
					></input>
					<FontAwesomeIcon icon={faSearch} onClick={busquedaHandler} />
					<Tooltip position='bottom' content='borrar texto'>
						<button id='btn-clear' className='btn-clear' onClick={clearSearch}>
							&#10008;
						</button>
					</Tooltip>
				</div>

				<Link to='/createregistro'>
					<button type='button' className='margenes color'>
						Agregar Egreso
					</button>
				</Link>
			</div>

			{loadingDelete && <LoadingBox></LoadingBox>}
			{errorDelete && <MessageBox variant='danger'>{errorDelete}</MessageBox>}
			{loading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant='danger'>{error}</MessageBox>
			) : (
				<React.Fragment key={99}>
					<table
						className='table table-container__table table-container__table--break-sm'
						id='product-list-table'
					>
						<thead>
							<tr>
								<th className='hidden'>ID-Producto</th>
								<th>Fecha</th>
								<th>Beneficiario</th>
								<th>Referencia</th>
								<th>Tipo-Doc</th>
								<th>Categoria</th>
								<th>Descripcion</th>
								<th>Monto US$</th>
								<th>Monto Bs.</th>
								<th>Cambio</th>
								<th>imagen</th>

								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{registros.map((registro) => (
								<tr key={registro._id}>
									<td className='hidden' data-heading='ID-REGISTRO'>
										{registro._id}
									</td>
									<td data-heading='Fecha'>{registro.fecha}</td>
									<td data-heading='Beneficiario' title={registro.beneficiario}>
										{registro.beneficiario}
									</td>
									<td data-heading='Referencia' title={registro.referencia}>
										{registro.referencia}
									</td>
									<td data-heading='Tipo Documento' title={registro.tipodoc}>
										{registro.tipodoc}
									</td>
									<td data-heading='Categoria' title={registro.categoria}>
										{registro.categoria}
									</td>

									<td data-heading='Descripcion'>{registro.descripcion}</td>
									<td data-heading='Monto US$'>{registro.montousd}</td>

									<td data-heading='Monto Bs.'>{registro.montobs}</td>
									<td data-heading='Cambio'>{registro.cambio}</td>
									<td data-heading='Imagen'>
										<img
											className='tiny-image'
											src={registro.imageurl}
											alt='foto'
										></img>
									</td>
									<td data-heading='Acciones'>
										<button
											type='button'
											className='small btn-circle'
											onClick={() => navigate(`/registro/${registro._id}/edit`)}
										>
											<FontAwesomeIcon icon={faPencilAlt} />
										</button>
										<button
											type='button'
											className='small btn-circle'
											onClick={() => deleteHandler(registro)}
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</React.Fragment>
			)}
		</div>
	);
}
