import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '../components/Tooltip';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { faFileContract, faFileLines, faPaste, faSearch, faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons';

export default function OrderListScreen(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf('/seller') >= 0;

  const { pageNumber = 1 } = useParams();
  const [group, setGroup] = useState([...Array(5).keys()]);

  const orderList = useSelector(state => state.orderList);
  const { loading, error, orders, page, pages } = orderList;

  const orderDelete = useSelector(state => state.orderDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = orderDelete;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders({ pageNumber }));
  }, [dispatch, pageNumber, sellerMode, successDelete, userInfo._id]);
  const deleteHandler = order => {
    if (window.confirm('Esta Seguro que Quiere Eliminar este Pedido?')) {
      dispatch(deleteOrder(order._id));
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
                <th>Usuario</th>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Metodo Pago</th>
                <th>Pagado?</th>
                <th>Confirmado?</th>
                <th>Monto</th>
                <th>Confirmado Por</th>
                <th>Entregado?</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td data-heading="Usuario">{order.email}</td>
                  <td data-heading="Vendedor?">{order.isVendedor ? order.vendedorInfo.nombre : 'venta-externa'}</td>
                  <td data-heading="Fecha Compra">{format(new Date(order.createdAt), 'dd-MM-yyyy')}</td>
                  <td data-heading="Precio Total">{order.totalPrice.toFixed(2)}</td>
                  <td data-heading="Metodo Pago">{order.paymentMethod}</td>
                  <td data-heading="Pagada?">{order.isPaid ? format(new Date(order.paidAt), 'dd-MM-yyyy') : 'No'}</td>
                  <td data-heading="Pagada?">{order.paymentResult.status === 'CONFIRMADO' ? 'SI' : 'No'}</td>
                  <td data-heading="Monto">{order.paymentResult.montotransfer}</td>
                  <td data-heading="Confirmado Por">{order.paymentResult.confirmador}</td>
                  <td data-heading="Entregado?">
                    {order.isDelivered ? format(new Date(order.deliveredAt), 'dd-MM-yyyy') : 'No'}
                  </td>
                  <td data-heading="Acciones" className="menu-show-all">
                    <Tooltip position="left" content="Detalle del Pedido">
                      <button
                        className="small btn-circle"
                        type="button"
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                      >
                        <FontAwesomeIcon className="search-product-icon" icon={faSearch} />
                      </button>
                    </Tooltip>

                    <Tooltip position="left" content="Factura">
                      <button
                        type="button"
                        className="small btn-circle"
                        onClick={() => navigate(`/printorder/${order._id}?tipo=${'factura'}`)}
                      >
                        <FontAwesomeIcon icon={faFileLines} />
                      </button>
                    </Tooltip>
                    <Tooltip position="left" content="Nota/Entrega">
                      <button
                        type="button"
                        className="small btn-circle"
                        onClick={() => navigate(`/printorder/${order._id}?tipo=${'notaentrega'}`)}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                      </button>
                    </Tooltip>
                    <Tooltip position="left" content="Nota/Almacen">
                      <button
                        type="button"
                        className="small btn-circle"
                        onClick={() => navigate(`/printorder/${order._id}?tipo=${'notaalmacen'}`)}
                      >
                        <FontAwesomeIcon icon={faPaste} />
                      </button>
                    </Tooltip>
                    <Tooltip position="left" content="Eliminar Este Pedido">
                      <button type="button" className="small btn-circle" onClick={() => deleteHandler(order)}>
                        <FontAwesomeIcon icon={faTrash} />
                        <i className="fas fa-trash"></i>
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
