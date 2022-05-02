import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deliverOrder, detailsOrder, payconfirmOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELIVER_RESET, ORDER_PAYCONFIRM_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';
import { format } from 'date-fns';
import { faEye, faFileContract, faFileMedical, faHouseUser, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '../components/Tooltip';
import Select from 'react-select';

export default function OrderScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;
  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector(state => state.orderPay);
  const { success: successPay } = orderPay;
  const orderPayconfirm = useSelector(state => state.orderPayconfirm);
  const { success: successPayconfirm } = orderPayconfirm;
  const orderDeliver = useSelector(state => state.orderDeliver);
  const { success: successDeliver } = orderDeliver;
  const dispatch = useDispatch();

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
      width: 250,
    }),
  };

  const selectMonedas = [
    { value: 'US$', label: 'US$' },
    { value: 'EURO', label: 'EURO' },
    { value: 'Bs.', label: 'Bs.' },
  ];

  const dataBancos = [
    '',
    'Banesco',
    'Venezuela',
    'Mercantil',
    'Provincial',
    'Banco del Caribe',
    'Banco BNC',
    'Banco BOD',
    'Banco del Tesoro',
    'Vzlano de Credito',
    'Banca Amiga',
    'Otro Banco',
  ];

  const [referencia, setReferencia] = useState('');
  const [banco, setBanco] = useState('');
  const [fechaTransfer, setFechaTransfer] = useState('');
  const [refzelle, setRefzelle] = useState('');
  const [cuentazelle, setCuentazelle] = useState('');
  const [refpagomobil, setRefpagomobil] = useState('');
  const [refpagoefectivo, setRefpagoefectivo] = useState('');
  const [montotransfer, setMontotransfer] = useState('');
  const [montozelle, setMontozelle] = useState('');
  const [montopagomobil, setMontopagomobil] = useState('');
  const [monedas, setMonedas] = useState([]);

  useEffect(() => {
    if (!order || successPay || successDeliver || successPayconfirm || (order && order._id !== orderId)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_PAYCONFIRM_RESET });
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, orderId, successPay, successDeliver, order, successPayconfirm]);

  const procesarPago = () => {
    if (!fechaTransfer) {
      toast.info('Ingrese una Fecha de Pago!', {
        position: 'top-center',
        autoClose: 2000,
      });
      return;
    }

    if (order.paymentMethod === 'Transferencia') {
      if (!banco) {
        toast.info('Selecciones el Banco!', {
          position: 'top-center',
          autoClose: 2000,
        });
        return;
      }
      if (!referencia) {
        toast.info('Falta Numero de Referencia.', {
          position: 'top-center',
          autoClose: 2000,
        });
        return;
      }
      if (montotransfer < 1) {
        toast.info('Monto Invalido!', {
          position: 'top-center',
          autoClose: 2000,
        });
        return;
      }
    }

    if (!referencia && !refzelle && !cuentazelle && !refpagoefectivo && !refpagomobil) {
      toast.info('Faltan Datos por llenar (referencias)!');
      return;
    }

    const paymentResult = {
      id: orderId,
      status: 'POR_CONFIRMAR',
      email_address: userInfo.email,
      banco: banco,
      referencia: referencia,
      fechaTransferencia: fechaTransfer,
      refzelle: refzelle,
      cuentazelle: cuentazelle,
      refpagomobil: refpagomobil,
      refpagoefectivo: refpagoefectivo,
      montotransfer: montotransfer,
      montozelle: montozelle,
      montopagomobil: montopagomobil,
      monedas: monedas,
    };

    dispatch(payOrder(order, paymentResult));
    navigate(`/signin?redirect=/order/${order._id}`);
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  const payconfirmHandler = () => {
    dispatch(payconfirmOrder(order._id, userInfo.email));
  };

  console.log('ORDER SCREEN: order:', order);
  console.log('ORDER SCREEN: userInfo', userInfo);

  const monedasChanges = valor => {
    setMonedas(valor);
    console.log('monedas', monedas);
  };

  const mostrarValor = valor => {
    if (!valor) {
      return;
    }
    const items = valor.map(v => ' ' + v.value);
    console.log('items array:', items);
    return items;
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row top">
        <div className="col-2">
          <div className="div-info-user">
            <div className="order-botones-print">
              <Tooltip position="left" content="Nota de Entrega">
                <button
                  type="button"
                  className="btn-print-order"
                  onClick={() => navigate(`/printorder/${order._id}?tipo=${'notaentrega'}`)}
                >
                  <FontAwesomeIcon icon={faUserPen} />
                </button>
              </Tooltip>
              <Tooltip position="left" content="Nota de Almacen">
                <button
                  type="button"
                  className="btn-print-order almacen"
                  onClick={() => navigate(`/printorder/${order._id}?tipo=${'notaalmacen'}`)}
                >
                  <FontAwesomeIcon icon={faHouseUser} />
                </button>
              </Tooltip>
            </div>
            <p>
              <strong>Pedido No:</strong> {order._id.substr(14, 10)} <br />
              <strong>Nombre: </strong>{' '}
              {order.isVendedor ? order.clienteInfo.nombre : userInfo.nombre + ' ' + userInfo.apellido}
              <br />
              <strong>RIF / Cedula: </strong>
              {order.isVendedor ? order.clienteInfo.nic : userInfo.cedula}
              <br />
              <strong>Telefonos: </strong>
              {order.isVendedor
                ? order.clienteInfo?.telefono + ' ' + order.clienteInfo.celular
                : userInfo.telefono}{' '}
              <br />
              <strong>Direccion: </strong>{' '}
              {order.isVendedor
                ? order.clienteInfo.direccion
                : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
              <br />
              <strong>Metodo de Pago:</strong> {order.paymentMethod}
            </p>

            <div className="order-status">
              <p>
                <strong>Status:</strong>
              </p>
              {order.isPaid && order.paymentResult.status === 'CONFIRMADO' ? (
                <>
                  <p className="status-line">Pago Confirmado</p>
                </>
              ) : order.isPaid && order.paymentResult.status === 'POR_CONFIRMAR' ? (
                <>
                  <p className="status-line">Pagado (confirmacion Pendiente)</p>
                </>
              ) : (
                <>
                  <p className="status-line">NO PAGADO</p>
                </>
              )}
              {order.isDelivered ? (
                <>
                  <p className="status-line">Entegrado:{format(new Date(order.paidAt), 'dd-MM-yyyy')}</p>
                </>
              ) : (
                <>
                  <p className="status-line">Por Entregar</p>
                </>
              )}
            </div>
          </div>
          <ul>
            <li>
              <h2>Articulos Comprados</h2>
              <div>
                <ul>
                  {order.orderItems.map((item, inx) => (
                    <li key={item.producto + inx}>
                      <div className="row shadow place-order">
                        <div>
                          <img src={item.imageurl} alt="foto" className="small"></img>
                        </div>
                        <div className="min-30 nombre-producto place-order">
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
        <div className="col1-place-order">
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
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Cobro por Envio</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Impuestos</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <hr />
              <li>
                <div className="row">
                  <div>
                    <strong> Total a Pagar</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li className="row center">
                  <br />
                  <h2>Informacion de Pago</h2>
                  <div>
                    <label htmlFor="fechaTransfer">Fecha de Pago </label>
                    <input
                      id="fecha-transfer"
                      type="date"
                      value={fechaTransfer}
                      required
                      onChange={e => setFechaTransfer(e.target.value)}
                    ></input>
                  </div>
                  {order.paymentMethod === 'Transferencia' ||
                  order.paymentMethod === 'Pago-Mixto' ||
                  order.paymentMethod === 'Pago-Mobil' ? (
                    <>
                      <div>
                        <label htmlFor="selectBancos">Banco de Pago </label>
                        <select
                          value={banco}
                          id="selectBancos"
                          placeholder="ingrese banco"
                          onChange={e => setBanco(e.target.value)}
                        >
                          {dataBancos.map((x, inx) => (
                            <option key={inx} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      {order.paymentMethod === 'Transferencia' ? (
                        <div>
                          <div>
                            <label htmlFor="referencia">Referencia Nro.</label>
                            <input
                              id="referencia"
                              type="text"
                              value={referencia}
                              placeholder="numero de transferencia"
                              onChange={e => setReferencia(e.target.value)}
                            ></input>
                          </div>
                          <div>
                            <label htmlFor="montotransfer">Monto Dep Bs. </label>
                            <input
                              id="montotransfer"
                              type="number"
                              value={montotransfer}
                              placeholder={(order.totalPrice * order.cambioDia).toFixed(2) + ' Bs.'}
                              onChange={e => setMontotransfer(e.target.value)}
                            ></input>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    ''
                  )}

                  {order.paymentMethod === 'Zelle' || order.paymentMethod === 'Pago-Mixto' ? (
                    <>
                      <div>
                        <label htmlFor="zelle">Zelle Ref. Nro. </label>
                        <input
                          id="zelle"
                          type="text"
                          value={refzelle}
                          placeholder="numero de transaccion Zelle"
                          onChange={e => setRefzelle(e.target.value)}
                        ></input>
                      </div>
                      <div>
                        <label htmlFor="ctazelle">Zelle Titular Cta </label>
                        <input
                          id="ctazelle"
                          type="text"
                          value={cuentazelle}
                          placeholder="nombre del titular del Zelle"
                          onChange={e => setCuentazelle(e.target.value)}
                        ></input>
                      </div>
                      <div>
                        <label htmlFor="montozelle">Monto Zelle </label>
                        <input
                          id="montozelle"
                          type="number"
                          value={montozelle}
                          placeholder="monto pagado con zelle"
                          onChange={e => setMontozelle(e.target.value)}
                        ></input>
                      </div>
                    </>
                  ) : (
                    ''
                  )}

                  {order.paymentMethod === 'Pago-Mobil' || order.paymentMethod === 'Pago-Mixto' ? (
                    <>
                      <div>
                        <label htmlFor="referencia">Pago-Mobil Ref </label>
                        <input
                          id="pagomobil-ref"
                          type="text"
                          value={refpagomobil}
                          placeholder="datos del pagomobil"
                          onChange={e => setRefpagomobil(e.target.value)}
                        ></input>
                      </div>
                      <div>
                        <label htmlFor="montopagomobil">Monto Dep Bs. </label>
                        <input
                          id="montopagomobil"
                          type="number"
                          value={montopagomobil}
                          placeholder="monto del pagomobil"
                          onChange={e => setMontopagomobil(e.target.value)}
                        ></input>
                      </div>
                    </>
                  ) : (
                    ''
                  )}

                  {order.paymentMethod === 'Efectivo' || order.paymentMethod === 'Pago-Mixto' ? (
                    <>
                      <div className="multiselect monedas">
                        <Select
                          id="select13"
                          options={selectMonedas}
                          styles={customStyles}
                          value={monedas}
                          isMulti
                          noOptionsMessage={() => 'No existe esa opcion en la lista'}
                          isSearchable
                          placeholder="Pago En Efectivo (Monedas)"
                          onChange={monedasChanges}
                        />
                      </div>
                      <div>
                        <textarea
                          id="pagoefectivo"
                          rows="2"
                          type="text"
                          required
                          placeholder="detallar los billetes recibidos o cualquier otra informacion necesaria"
                          value={refpagoefectivo}
                          onChange={e => setRefpagoefectivo(e.target.value)}
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    ''
                  )}

                  <button className="primary block" id="pay-btn" onClick={procesarPago}>
                    Enviar informacion de Pago
                  </button>
                </li>
              )}

              {userInfo.isAdmin && (
                <li className="botonera-admin">
                  <div className="row center">
                    <h1>Administrador</h1>
                  </div>

                  <button
                    className={
                      order.paymentResult?.status === 'CONFIRMADO'
                        ? 'primary block pedido-pagado'
                        : 'primary block pedido-pendiente'
                    }
                    id="confirm-pay-btn"
                    disabled={order.paymentResult?.status === 'CONFIRMADO'}
                    onClick={payconfirmHandler}
                  >
                    Confirmar Pago Recibido
                  </button>
                  <button
                    className={
                      order.isDelivered ? 'primary block pedido-entregado' : 'primary block pedido-por-entregar'
                    }
                    id="deliver-btn"
                    disabled={order.isDelivered}
                    onClick={deliverHandler}
                  >
                    Confirmar Pedido Entregado
                  </button>
                </li>
              )}
            </ul>

            {order.isPaid && (
              <div className="cuadro-detalle-pago">
                <p className="small-p">
                  <strong>Fecha Pago:</strong> {format(new Date(order.paymentResult.fechaTransferencia), 'dd-MM-yyyy')}{' '}
                  <br />
                  {order.paymentResult.banco ? `Banco: ${order.paymentResult.banco}` : ''}
                  {order.paymentResult.banco && <br />}
                  {order.paymentResult.referencia ? `Referencia: ${order.paymentResult.referencia}` : ''}
                  {order.paymentResult.referencia && <br />}
                  {order.paymentResult.montotransfer
                    ? `Monto Depositado: ${order.paymentResult.montotransfer} Bs.`
                    : ''}
                  {order.paymentResult.montotransfer && <br />}
                  {order.paymentResult.refpagomobil ? `Ref. Pago-Mobil: ${order.paymentResult.refpagomobil}` : ''}
                  {order.paymentResult.refpagomobil && <br />}
                  {order.paymentResult.montopagomobil
                    ? `Monto Pago Mobil: ${order.paymentResult.montopagomobil} Bs.`
                    : ''}
                  {order.paymentResult.montopagomobil && <br />}
                  {order.paymentResult.refzelle ? `Refer. Zelle: ${order.paymentResult.refzelle}` : ''}
                  {order.paymentResult.refzelle && <br />}
                  {order.paymentResult.cuentazelle ? `Titular Zelle: ${order.paymentResult.cuentazelle}` : ''}
                  {order.paymentResult.cuentazelle && <br />}
                  {order.paymentResult.montozelle ? `Monto Pago Zelle: ${order.paymentResult.montozelle} Bs.` : ''}
                  {order.paymentResult.montozelle && <br />}
                  {order.paymentResult.monedas ? `Monedas Recibidas: ${mostrarValor(order.paymentResult.monedas)}` : ''}
                  {order.paymentResult.monedas && <br />}
                  {order.paymentResult.refpagoefectivo
                    ? `Detalle Pago Efectivo: ${order.paymentResult.refpagoefectivo}`
                    : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
