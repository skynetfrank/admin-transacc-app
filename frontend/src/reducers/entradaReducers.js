import {
  ENTRADA_CREATE_FAIL,
  ENTRADA_CREATE_REQUEST,
  ENTRADA_CREATE_RESET,
  ENTRADA_CREATE_SUCCESS,
  ENTRADA_DETAILS_FAIL,
  ENTRADA_DETAILS_REQUEST,
  ENTRADA_DETAILS_SUCCESS,
  ENTRADA_MINE_LIST_FAIL,
  ENTRADA_MINE_LIST_REQUEST,
  ENTRADA_MINE_LIST_SUCCESS,
  ENTRADA_PAY_FAIL,
  ENTRADA_PAY_REQUEST,
  ENTRADA_PAY_RESET,
  ENTRADA_PAY_SUCCESS,
  ENTRADA_LIST_REQUEST,
  ENTRADA_LIST_SUCCESS,
  ENTRADA_LIST_FAIL,
  ENTRADA_DELETE_REQUEST,
  ENTRADA_DELETE_SUCCESS,
  ENTRADA_DELETE_FAIL,
  ENTRADA_DELETE_RESET,
  ENTRADA_DELIVER_REQUEST,
  ENTRADA_DELIVER_SUCCESS,
  ENTRADA_DELIVER_FAIL,
  ENTRADA_DELIVER_RESET,
  ENTRADA_SUMMARY_REQUEST,
  ENTRADA_SUMMARY_SUCCESS,
  ENTRADA_SUMMARY_FAIL,
  ENTRADA_PAYCONFIRM_REQUEST,
  ENTRADA_PAYCONFIRM_SUCCESS,
  ENTRADA_PAYCONFIRM_FAIL,
  ENTRADA_PAYCONFIRM_RESET,
} from '../constants/entradaConstants';

export const entradaCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ENTRADA_CREATE_REQUEST:
      return { loading: true };
    case ENTRADA_CREATE_SUCCESS:
      return { loading: false, success: true, entrada: action.payload };
    case ENTRADA_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ENTRADA_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const entradaDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case ENTRADA_DETAILS_REQUEST:
      return { loading: true };
    case ENTRADA_DETAILS_SUCCESS:
      return { loading: false, entrada: action.payload };
    case ENTRADA_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const entradaPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ENTRADA_PAY_REQUEST:
      return { loading: true };
    case ENTRADA_PAY_SUCCESS:
      return { loading: false, success: true };
    case ENTRADA_PAY_FAIL:
      return { loading: false, error: action.payload };
    case ENTRADA_PAY_RESET:
      return {};
    default:
      return state;
  }
};
export const entradaMineListReducer = (state = { entradas: [] }, action) => {
  switch (action.type) {
    case ENTRADA_MINE_LIST_REQUEST:
      return { loading: true };
    case ENTRADA_MINE_LIST_SUCCESS:
      return { loading: false, entradas: action.payload };
    case ENTRADA_MINE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const entradaListReducer = (state = { entradas: [] }, action) => {
  switch (action.type) {
    case ENTRADA_LIST_REQUEST:
      return { loading: true };
    case ENTRADA_LIST_SUCCESS:
      return { loading: false, entradas: action.payload };
    case ENTRADA_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const entradaDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ENTRADA_DELETE_REQUEST:
      return { loading: true };
    case ENTRADA_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ENTRADA_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case ENTRADA_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const entradaDeliverReducer = (state = {}, action) => {
  switch (action.type) {
    case ENTRADA_DELIVER_REQUEST:
      return { loading: true };
    case ENTRADA_DELIVER_SUCCESS:
      return { loading: false, success: true };
    case ENTRADA_DELIVER_FAIL:
      return { loading: false, error: action.payload };
    case ENTRADA_DELIVER_RESET:
      return {};
    default:
      return state;
  }
};

export const entradaSummaryReducer = (state = { loading: true, summary: {} }, action) => {
  switch (action.type) {
    case ENTRADA_SUMMARY_REQUEST:
      return { loading: true };
    case ENTRADA_SUMMARY_SUCCESS:
      return { loading: false, summary: action.payload };
    case ENTRADA_SUMMARY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const entradaPayconfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case ENTRADA_PAYCONFIRM_REQUEST:
      return { loading: true };
    case ENTRADA_PAYCONFIRM_SUCCESS:
      return { loading: false, success: true };
    case ENTRADA_PAYCONFIRM_FAIL:
      return { loading: false, error: action.payload };
    case ENTRADA_PAYCONFIRM_RESET:
      return {};
    default:
      return state;
  }
};
