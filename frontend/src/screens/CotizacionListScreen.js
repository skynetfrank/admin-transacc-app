import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '../components/Tooltip';
import { deleteCotizacion, listCotizaciones } from '../actions/cotizacionActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { COTIZACION_DELETE_RESET } from '../constants/cotizacionConstants';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { faFileContract, faFileLines, faPaste, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function OrderListScreen(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf('/seller') >= 0;

  const { pageNumber = 1 } = useParams();
  const [group, setGroup] = useState([...Array(5).keys()]);

  const cotizacionList = useSelector(state => state.cotizacionList);
  const { loading, error, cotizaciones, page, pages } = cotizacionList;

  const cotizacionDelete = useSelector(state => state.cotizacionDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = cotizacionDelete;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: COTIZACION_DELETE_RESET });
    dispatch(listCotizaciones({ pageNumber }));
  }, [dispatch, pageNumber, sellerMode, successDelete, userInfo._id]);
  const deleteHandler = order => {
    if (window.confirm('Esta Seguro que Quiere Eliminar esta Cotizacion?')) {
      dispatch(deleteCotizacion(order._id));
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

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  console.log('Cotizaciones list', cotizaciones);
  return (
    <div>
      <div className="row center">
        <h1>Listado de Pedidos</h1>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <React.Fragment key={99}>
          <table className="table table-container__table table-container__table--break-sm">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Preparado Por</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map(cotz => (
                <tr key={cotz._id}>
                  <td data-heading="Usuario">{cotz.clienteInfo.nombre}</td>
                  <td data-heading="Emision">{format(new Date(cotz.createdAt), 'dd-MM-yyyy')}</td>
                  <td data-heading="Total">{cotz.totalPrice.toFixed(2)}</td>
                  <td data-heading="Confirmado Por">{cotz.vendedorInfo.email}</td>
                  <td data-heading="Acciones" className="menu-show-all">
                    <Tooltip position="left" content="Detalle del Pedido">
                      <button
                        className="small btn-circle"
                        type="button"
                        onClick={() => {
                          navigate(`/cotizacion/${cotz._id}`);
                        }}
                      >
                        <FontAwesomeIcon className="search-product-icon" icon={faSearch} />
                      </button>
                    </Tooltip>

                    <Tooltip position="left" content="Factura">
                      <button
                        type="button"
                        className="small btn-circle"
                        onClick={() => navigate(`/printcotizacion/${cotz._id}`)}
                      >
                        <FontAwesomeIcon icon={faFileLines} />
                      </button>
                    </Tooltip>

                    <Tooltip position="left" content="Eliminar Cotizacion">
                      <button type="button" className="small btn-circle" onClick={() => deleteHandler(cotz)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            <button onClick={firstPage}>#1</button>
            <button onClick={previousPages}>&#10096;</button>

            {group.map(x => (
              <Link
                className={x + 1 === page ? 'active' : x + 1 > pages ? 'outta-range' : ''}
                key={x + 1}
                to={`/orderlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
            <button onClick={nextPages}>&#10097;</button>
            <Tooltip position="top" content="Ultimo">
              <button onClick={lastPage}>{pages}</button>
            </Tooltip>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
