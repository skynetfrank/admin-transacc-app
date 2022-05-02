import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '../components/Tooltip';
import { deleteEntrada, listEntradas } from '../actions/entradaActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ENTRADA_DELETE_RESET } from '../constants/entradaConstants';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
	faFileContract,
	faFileLines,
	faPaste,
	faPrint,
	faSearch,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';

export default function EntradaListScreen(props) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const sellerMode = pathname.indexOf('/seller') >= 0;
	const entradaList = useSelector((state) => state.entradaList);
	const { loading, error, entradas } = entradaList;
	const entradaDelete = useSelector((state) => state.entradaDelete);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = entradaDelete;

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch({ type: ENTRADA_DELETE_RESET });
		dispatch(listEntradas({ seller: sellerMode ? userInfo._id : '' }));
	}, [dispatch, sellerMode, successDelete, userInfo._id]);
	const deleteHandler = (entrada) => {
		if (
			window.confirm('Esta Seguro que Quiere Eliminar esta Nota de Entrada?')
		) {
			dispatch(deleteEntrada(entrada._id));
		}
	};
	console.log('entradas Listado data:', entradas);

	const notaalmacenHandler = () => {};
	return (
		<div>
			<div className='row'>
				<h1 className='margenes'>Entradas de Productos</h1>

				<Link to='/entrada'>
					<button type='button' className='margenes color'>
						Crear Nota de Entrada
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
				<table className='table table-container__table table-container__table--break-sm'>
					<thead>
						<tr>
							<th>ID-ENTRADA</th>
							<th>Fecha</th>
							<th>Movimiento</th>
							<th>Tipo-Documento</th>
							<th>Documento #</th>
							<th>Total</th>
							<th>Usuario</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{entradas.map((entrada) => (
							<tr key={entrada._id}>
								<td data-heading='ID-ENTRADA'>{entrada.notaNumero}</td>

								<td data-heading='Fecha Compra'>
									{format(new Date(entrada.createdAt), 'dd-MM-yyyy')}
								</td>
								<td data-heading='Movimiento'>{entrada.tipoMovimiento}</td>
								<td data-heading='Tipo Documento'>{entrada.tipoDoc}</td>
								<td data-heading='No. Documento'>{entrada.numeroDocumento}</td>
								<td data-heading='Precio Total'>
									{entrada.totalPrice.toFixed(2)}
								</td>
								<td data-heading='Usuario'>{entrada.email}</td>
								<td data-heading='Acciones' className='menu-show-all'>
									<Tooltip position='left' content='Detalle del Pedido'>
										<button
											className='small btn-circle'
											type='button'
											onClick={() => {
												navigate(`/entrada/${entrada._id}`);
											}}
										>
											<FontAwesomeIcon
												className='search-product-icon'
												icon={faSearch}
											/>
										</button>
									</Tooltip>

									<Tooltip position='left' content='Nota/Almacen'>
										<button
											type='button'
											className='small btn-circle'
											onClick={notaalmacenHandler}
										>
											<FontAwesomeIcon icon={faPrint} />
										</button>
									</Tooltip>
									<Tooltip position='left' content='Eliminar Este Pedido'>
										<button
											type='button'
											className='small btn-circle'
											onClick={() => deleteHandler(entrada)}
										>
											<FontAwesomeIcon icon={faTrash} />
											<i className='fas fa-trash'></i>
										</button>
									</Tooltip>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
