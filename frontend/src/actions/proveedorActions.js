import Axios from 'axios';
import {
  PROVEEDOR_DETAILS_FAIL,
  PROVEEDOR_DETAILS_REQUEST,
  PROVEEDOR_DETAILS_SUCCESS,
  PROVEEDOR_REGISTER_FAIL,
  PROVEEDOR_REGISTER_REQUEST,
  PROVEEDOR_REGISTER_SUCCESS,
  PROVEEDOR_UPDATE_PROFILE_FAIL,
  PROVEEDOR_UPDATE_PROFILE_REQUEST,
  PROVEEDOR_UPDATE_PROFILE_SUCCESS,
  PROVEEDOR_LIST_REQUEST,
  PROVEEDOR_LIST_SUCCESS,
  PROVEEDOR_LIST_FAIL,
  PROVEEDOR_DELETE_REQUEST,
  PROVEEDOR_DELETE_SUCCESS,
  PROVEEDOR_DELETE_FAIL,
} from '../constants/proveedorConstants';

export const registerProveedor =
  (
    nombre,
    email,
    rif,
    celular,
    telefono,
    direccion,
    condiciones,
    diasCredito,
    descuento,
    prontopago,
    contacto,
    observaciones
  ) =>
  async dispatch => {
    dispatch({
      type: PROVEEDOR_REGISTER_REQUEST,
      payload: {
        nombre,
        email,
        rif,
        celular,
        telefono,
        direccion,
        condiciones,
        diasCredito,
        descuento,
        prontopago,
        contacto,
        observaciones,
      },
    });
    try {
      const { data } = await Axios.post('/api/Proveedores/register', {
        nombre,
        email,
        rif,
        celular,
        telefono,
        direccion,
        condiciones,
        diasCredito,
        descuento,
        prontopago,
        contacto,
        observaciones,
      });
      dispatch({ type: PROVEEDOR_REGISTER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PROVEEDOR_REGISTER_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    }
  };

export const detailsProveedor = proveedorId => async (dispatch, getState) => {
  dispatch({ type: PROVEEDOR_DETAILS_REQUEST, payload: proveedorId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/proveedores/${proveedorId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROVEEDOR_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PROVEEDOR_DETAILS_FAIL, payload: message });
  }
};

export const updateProveedorProfile = proveedor => async (dispatch, getState) => {
  dispatch({ type: PROVEEDOR_UPDATE_PROFILE_REQUEST, payload: proveedor });

  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/proveedores/profile`, proveedor, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROVEEDOR_UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PROVEEDOR_UPDATE_PROFILE_FAIL, payload: message });
  }
};

export const listProveedores = () => async (dispatch, getState) => {
  dispatch({ type: PROVEEDOR_LIST_REQUEST });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.get('/api/proveedores', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: PROVEEDOR_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PROVEEDOR_LIST_FAIL, payload: message });
  }
};

export const deleteProveedor = proveedorId => async (dispatch, getState) => {
  dispatch({ type: PROVEEDOR_DELETE_REQUEST, payload: proveedorId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.delete(`/api/proveedores/${proveedorId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROVEEDOR_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PROVEEDOR_DELETE_FAIL, payload: message });
  }
};
