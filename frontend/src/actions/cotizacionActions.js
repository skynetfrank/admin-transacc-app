import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import {
  COTIZACION_CREATE_FAIL,
  COTIZACION_CREATE_REQUEST,
  COTIZACION_CREATE_SUCCESS,
  COTIZACION_DETAILS_FAIL,
  COTIZACION_DETAILS_REQUEST,
  COTIZACION_DETAILS_SUCCESS,
  COTIZACION_MINE_LIST_REQUEST,
  COTIZACION_MINE_LIST_FAIL,
  COTIZACION_MINE_LIST_SUCCESS,
  COTIZACION_LIST_REQUEST,
  COTIZACION_LIST_SUCCESS,
  COTIZACION_LIST_FAIL,
  COTIZACION_DELETE_REQUEST,
  COTIZACION_DELETE_SUCCESS,
  COTIZACION_DELETE_FAIL,
  COTIZACION_SUMMARY_REQUEST,
  COTIZACION_SUMMARY_SUCCESS,
} from '../constants/cotizacionConstants';

export const createCotizacion = cotizacion => async (dispatch, getState) => {
  console.log('ACTIONS cotizacion recibida para enviar al router', cotizacion);
  dispatch({ type: COTIZACION_CREATE_REQUEST, payload: cotizacion });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.post('/api/cotizaciones', cotizacion, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    console.log('ACTIONS CREATE-COTIZACION data.cotizacion (from router', data.cotizacion);
    dispatch({ type: COTIZACION_CREATE_SUCCESS, payload: data.cotizacion });
    dispatch({ type: CART_EMPTY });
    localStorage.removeItem('cartItems');
    localStorage.removeItem('clienteInfo');
  } catch (error) {
    console.log("OCURRIO UN ERROR EN ACTIONS COTIZACIONES")
    dispatch({
      type: COTIZACION_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const detailsCotizacion = orderId => async (dispatch, getState) => {
  dispatch({ type: COTIZACION_DETAILS_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/cotizaciones/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: COTIZACION_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: COTIZACION_DETAILS_FAIL, payload: message });
  }
};

export const listCotizacionMine = () => async (dispatch, getState) => {
  dispatch({ type: COTIZACION_MINE_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get('/api/cotizaciones/mine', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: COTIZACION_MINE_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: COTIZACION_MINE_LIST_FAIL, payload: message });
  }
};

export const listCotizaciones =
  ({ pageNumber = '' }) =>
  async (dispatch, getState) => {
    dispatch({ type: COTIZACION_LIST_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.get(`/api/cotizaciones?pageNumber=${pageNumber}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: COTIZACION_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      dispatch({ type: COTIZACION_LIST_FAIL, payload: message });
    }
  };

export const deleteCotizacion = orderId => async (dispatch, getState) => {
  dispatch({ type: COTIZACION_DELETE_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/cotizaciones/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: COTIZACION_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: COTIZACION_DELETE_FAIL, payload: message });
  }
};

export const summaryCotizacion = () => async (dispatch, getState) => {
  dispatch({ type: COTIZACION_SUMMARY_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get('/api/cotizaciones/summary', {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: COTIZACION_SUMMARY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COTIZACION_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
