import {
  SETTINGS_DETAILS_FAIL,
  SETTINGS_DETAILS_REQUEST,
  SETTINGS_DETAILS_RESET,
  SETTINGS_DETAILS_SUCCESS,
  SETTINGS_LIST_FAIL,
  SETTINGS_LIST_REQUEST,
  SETTINGS_LIST_RESET,
  SETTINGS_LIST_SUCCESS,
  SETTINGS_UPDATE_FAIL,
  SETTINGS_UPDATE_REQUEST,
  SETTINGS_UPDATE_RESET,
  SETTINGS_UPDATE_SUCCESS,
} from '../constants/settingsConstants';

export const settingsDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case SETTINGS_DETAILS_REQUEST:
      return { loading: true };
    case SETTINGS_DETAILS_SUCCESS:
      return { loading: false, settings: action.payload };
    case SETTINGS_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case SETTINGS_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};

export const settingsUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE_REQUEST:
      return { loading: true };
    case SETTINGS_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case SETTINGS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case SETTINGS_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const settingsListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case SETTINGS_LIST_REQUEST:
      return { loading: true };
    case SETTINGS_LIST_SUCCESS:
      return { loading: false, settings: action.payload };
    case SETTINGS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SETTINGS_LIST_RESET:
      return {};
    default:
      return state;
  }
};
