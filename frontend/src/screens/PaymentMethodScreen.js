import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen(props) {
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  if (!shippingAddress.address && !userInfo.isVendedor) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('');
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };
  console.log('PaymentScreen cart:', cart);
  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      {userInfo.isVendedor && <h2 className="paymentmethod-cliente">Pedido para: {cart.clienteInfo.nombre}</h2>}
      <div className="form-title"></div>
      <form className="form payment" onSubmit={submitHandler}>
        <div className="form-title">
          <h1 className="grueso">Metodo de Pago</h1>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="transfer"
              value="Transferencia"
              name="paymentMethod"
              required
              onChange={e => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="transfer">Transferencia Bancaria (Bs.)</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="cash"
              value="Efectivo"
              name="paymentMethod"
              required
              onChange={e => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="cash">Pago en Efectivo</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="zelle-payment-screen"
              value="Zelle"
              name="paymentMethod"
              required
              onChange={e => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="zelle">Zelle (US$)</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="pagomobil"
              value="Pago-Mobil"
              name="paymentMethod"
              required
              onChange={e => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="pagomobil">Pago Mobil (Bs.)</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="pagomixto"
              value="Pago-Mixto"
              name="paymentMethod"
              required
              onChange={e => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="pagomixto">Pago Mixto</label>
          </div>
        </div>
        <div>
          <button className="primary" type="submit">
            Continuar...
          </button>
        </div>
      </form>
    </div>
  );
}
