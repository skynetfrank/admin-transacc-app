import Axios from 'axios';
import {
  SETTINGS_DETAILS_FAIL,
  SETTINGS_DETAILS_REQUEST,
  SETTINGS_DETAILS_SUCCESS,
  SETTINGS_UPDATE_FAIL,
  SETTINGS_UPDATE_REQUEST,
  SETTINGS_UPDATE_SUCCESS,
  SETTINGS_LIST_REQUEST,
  SETTINGS_LIST_SUCCESS,
  SETTINGS_LIST_FAIL,
} from '../constants/settingsConstants';

export const detailsSettings = settingsId => async (dispatch, getState) => {
  dispatch({ type: SETTINGS_DETAILS_REQUEST, payload: settingsId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/settings/${settingsId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    console.log('settingsId:', settingsId, 'data:', data);
    dispatch({ type: SETTINGS_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: SETTINGS_DETAILS_FAIL, payload: message });
  }
};

export const updateSettings = settings => async (dispatch, getState) => {
  console.log('ACTIONS SETTINGS UPDATE: settings', settings);
  dispatch({ type: SETTINGS_UPDATE_REQUEST, payload: settings });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/settings/${settings._id}`, settings, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: SETTINGS_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: SETTINGS_UPDATE_FAIL, payload: message });
  }
};

export const listSettings = () => async (dispatch, getState) => {
  dispatch({ type: SETTINGS_LIST_REQUEST });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.get('/api/settings', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: SETTINGS_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: SETTINGS_LIST_FAIL, payload: message });
  }
};
