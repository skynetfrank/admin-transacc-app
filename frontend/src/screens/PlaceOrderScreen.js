import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import { createCotizacion } from '../actions/cotizacionActions';
import { updateExistencia } from '../actions/productActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function PlaceOrderScreen(props) {
  const navigate = useNavigate();
  const [cambio, setCambio] = useState(1);
  const cart = useSelector(state => state.cart);

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  if (!cart.paymentMethod && userInfo.isVendedor) {
    navigate('/payment');
  }

  useEffect(() => {
    let isCancelled = false;
    const fetchCambio = async () => {
      try {
        const { data } = await axios.get('https://s3.amazonaws.com/dolartoday/data.json');
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
  console.log('cambio en plceOrder:', cambio);
  const orderCreate = useSelector(state => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const toPrice = num => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  cart.itemsPrice = toPrice(cart.cartItems.reduce((a, c) => a + c.qty * c.precio, 0));
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(0);
  cart.taxPrice = toPrice(0.16 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  cart.cambioDia = cambio;
  const dispatch = useDispatch();

  console.log('PlaceOrder Screen userInfo', userInfo);
  console.log('cart en placeOrder', cart);
  cart.isVendedor = userInfo.isVendedor;
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        ...cart,
        orderItems: cart.cartItems,
        clienteInfo: cart.clienteInfo,
        vendedorInfo: cart.vendedorInfo,
      })
    );
  };
  const placeCotizacionHandler = () => {
    dispatch(
      createCotizacion({
        ...cart,
        orderItems: cart.cartItems,
        clienteInfo: cart.clienteInfo,
        vendedorInfo: cart.vendedorInfo,
      })
    );
  };
  useEffect(() => {
    if (success) {
      navigate(`/signin?redirect=/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
      cart.cartItems.forEach(item => {
        console.log('item a procesar=>', item);
        const idProducto = item.producto;
        const cantidad = item.qty;
        const movimiento = 'salida';
        dispatch(updateExistencia({ idProducto, cantidad, movimiento }));
      });
    }
  }, [dispatch, order, navigate, success, cart.cartItems]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          {userInfo.isVendedor && (
            <div className="div-info-user">
              <p>
                <strong>R.I.F.:</strong> {cart.clienteInfo.nic} <br />
                <strong>Nombre:</strong> {cart.clienteInfo.nombre} <br />
                <strong>Direccion: </strong> {cart.clienteInfo.direccion}
                <br />
                <strong>Telefono: </strong>
                {cart.clienteInfo.celular} <br />
              </p>
              <p>
                <strong>Metodo de Pago:</strong> {cart.paymentMethod}
              </p>
            </div>
          )}
          {!userInfo.isVendedor && (
            <div className="div-info-user">
              <p>
                <strong>Nombre:</strong> {cart.shippingAddress.fullName}.{userInfo.telefono} <br />
                <strong>Direccion: </strong> {cart.shippingAddress.address},{cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
              <p>
                <strong>Metodo de Pago:</strong> {cart.paymentMethod}
              </p>
            </div>
          )}

          <ul>
            <li>
              <h2>Articulos a Comprar</h2>
              <div>
                <ul className="carrito-ul">
                  {cart.cartItems.map(item => (
                    <li key={item.producto}>
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
          <div className="card resumen">
            <ul>
              <li>
                <div className="row center">
                  <h1>Resumen</h1>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Productos</div>
                  <div>${cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Delivery</div>
                  <div>${cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Impuestos</div>
                  <div>${cart.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Total Pedido</strong>
                  </div>
                  <div>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!userInfo.isAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={placeOrderHandler}
                    className="primary block"
                    disabled={cart.cartItems.length === 0}
                  >
                    Confirmar Pedido
                  </button>
                </li>
              )}

              {userInfo.isAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={placeCotizacionHandler}
                    className="primary block"
                    disabled={cart.cartItems.length === 0}
                  >
                    Grabar Cotizacion
                  </button>
                </li>
              )}
              {loading && <LoadingBox></LoadingBox>}
              {error && <MessageBox variant="danger">{error}</MessageBox>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
