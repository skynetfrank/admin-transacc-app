import Axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_CLIENTE_INFO,
  CART_SAVE_VENDEDOR_INFO,
  CART_SAVE_CAMBIO_DIA,
} from '../constants/cartConstants';

export const addToCart = (productId, qty) => async (dispatch, getState) => {
  const { data } = await Axios.get(`/api/productos/${productId}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      nombre: data.nombre,
      codigo: data.codigo,
      marca: data.marca,
      descripcion: data.descripcion,
      imageurl: data.imageurl,
      precio: data.preciousd,
      existencia: data.existencia,
      producto: data._id,
      ubicacion: data.ubicacion,
      qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = productId => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: productId });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = data => dispatch => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const saveClienteInfo = data => dispatch => {
  dispatch({ type: CART_SAVE_CLIENTE_INFO, payload: data });
  localStorage.setItem('clienteInfo', JSON.stringify(data));
};

export const saveVendedorInfo = data => dispatch => {
  dispatch({ type: CART_SAVE_VENDEDOR_INFO, payload: data });
  localStorage.setItem('vendedorInfo', JSON.stringify(data));
};

export const savePaymentMethod = data => dispatch => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
};

export const saveCambioDia = data => dispatch => {
  dispatch({ type: CART_SAVE_CAMBIO_DIA, payload: data });
  localStorage.setItem('adminCambioDia', JSON.stringify(data));
  console.log('cart actions save triggered');
};
