import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { detailsCotizacion } from '../actions/cotizacionActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { format } from 'date-fns';
import { faHouseUser, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '../components/Tooltip';

export default function OrderScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: cotizacionId } = params;
  const cotizacionDetails = useSelector(state => state.cotizacionDetails);
  const { cotizacion, loading, error } = cotizacionDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!cotizacion || (cotizacion && cotizacion._id !== cotizacionId)) {
      dispatch(detailsCotizacion(cotizacionId));
    }
  }, [dispatch, cotizacionId, cotizacion]);

  console.log('COTIZACION SCREEN: cotizacion:', cotizacion);
  console.log('COTIZACION SCREEN: userInfo', userInfo);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row top">
        <div className="col-2">
          <div className="div-info-user">
            <div className="cotizacion-botones-print">
              <Tooltip position="left" content="Nota de Entrega">
                <button
                  type="button"
                  className="btn-print-order"
                  onClick={() => navigate(`/printcotizacion/${cotizacion._id}`)}
                >
                  <FontAwesomeIcon icon={faUserPen} />
                </button>
              </Tooltip>
            </div>
            <p>
              <strong>Cotizacion No:</strong> {cotizacion._id.substr(14, 10)} <br />
              <strong>Nombre: </strong>{' '}
              {cotizacion.isVendedor ? cotizacion.clienteInfo.nombre : userInfo.nombre + ' ' + userInfo.apellido}
              <br />
              <strong>RIF / Cedula: </strong>
              {cotizacion.isVendedor ? cotizacion.clienteInfo.nic : userInfo.cedula}
              <br />
              <strong>Telefonos: </strong>
              {cotizacion.isVendedor
                ? cotizacion.clienteInfo?.telefono + ' ' + cotizacion.clienteInfo.celular
                : userInfo.telefono}{' '}
              <br />
              <strong>Direccion: </strong>{' '}
              {cotizacion.isVendedor
                ? cotizacion.clienteInfo.direccion
                : `${cotizacion.shippingAddress.address}, ${cotizacion.shippingAddress.city}, ${cotizacion.shippingAddress.postalCode}, ${cotizacion.shippingAddress.country}`}
              <br />
            </p>
          </div>
          <ul>
            <li>
              <h2>Articulos Comprados</h2>
              <div>
                <ul>
                  {cotizacion.cotizacionItems.map((item, inx) => (
                    <li key={item.producto + inx}>
                      <div className="row shadow place-cotizacion">
                        <div>
                          <img src={item.imageurl} alt="foto" className="small"></img>
                        </div>
                        <div className="min-30 nombre-producto place-cotizacion">
                          <Link to={`/product/${item.producto}`}>
                            {item.nombre} ({item.ubicacion})
                          </Link>
                          <p id="mini-descripcion">{item.descripcion}</p>
                        </div>

                        <div className="qty-price">
                          <p>
                            {' '}
                            {item.qty} x ${item.precio} = ${item.qty * item.precio}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col1-place-cotizacion">
          <div className="card resumen pago">
            <ul>
              <li>
                <div className="row center">
                  <h1>Resumen</h1>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Total Productos</div>
                  <div>${cotizacion.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Cobro por Envio</div>
                  <div>${cotizacion.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Impuestos</div>
                  <div>${cotizacion.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <hr />
              <li>
                <div className="row">
                  <div>
                    <strong> Total a Pagar</strong>
                  </div>
                  <div>
                    <strong>${cotizacion.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
