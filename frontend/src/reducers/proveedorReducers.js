import {
  PROVEEDOR_DELETE_FAIL,
  PROVEEDOR_DELETE_REQUEST,
  PROVEEDOR_DELETE_RESET,
  PROVEEDOR_DELETE_SUCCESS,
  PROVEEDOR_DETAILS_FAIL,
  PROVEEDOR_DETAILS_REQUEST,
  PROVEEDOR_DETAILS_RESET,
  PROVEEDOR_DETAILS_SUCCESS,
  PROVEEDOR_LIST_FAIL,
  PROVEEDOR_LIST_REQUEST,
  PROVEEDOR_LIST_RESET,
  PROVEEDOR_LIST_SUCCESS,
  PROVEEDOR_REGISTER_FAIL,
  PROVEEDOR_REGISTER_REQUEST,
  PROVEEDOR_REGISTER_RESET,
  PROVEEDOR_REGISTER_SUCCESS,
  PROVEEDOR_UPDATE_PROFILE_FAIL,
  PROVEEDOR_UPDATE_PROFILE_REQUEST,
  PROVEEDOR_UPDATE_PROFILE_RESET,
  PROVEEDOR_UPDATE_PROFILE_SUCCESS,
} from '../constants/proveedorConstants';

export const proveedorRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case PROVEEDOR_REGISTER_REQUEST:
      return { loading: true };
    case PROVEEDOR_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case PROVEEDOR_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case PROVEEDOR_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const proveedorDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PROVEEDOR_DETAILS_REQUEST:
      return { loading: true };
    case PROVEEDOR_DETAILS_SUCCESS:
      return { loading: false, proveedor: action.payload };
    case PROVEEDOR_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case PROVEEDOR_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};

export const proveedorUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case PROVEEDOR_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case PROVEEDOR_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true };
    case PROVEEDOR_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case PROVEEDOR_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const proveedorListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PROVEEDOR_LIST_REQUEST:
      return { loading: true };
    case PROVEEDOR_LIST_SUCCESS:
      return { loading: false, proveedores: action.payload };
    case PROVEEDOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    case PROVEEDOR_LIST_RESET:
      return {};
    default:
      return state;
  }
};
export const proveedorDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PROVEEDOR_DELETE_REQUEST:
      return { loading: true };
    case PROVEEDOR_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PROVEEDOR_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PROVEEDOR_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
