import Axios from 'axios';
import {
	REGISTRO_CREATE_FAIL,
	REGISTRO_CREATE_REQUEST,
	REGISTRO_CREATE_SUCCESS,
	REGISTRO_DETAILS_FAIL,
	REGISTRO_DETAILS_REQUEST,
	REGISTRO_DETAILS_SUCCESS,
	REGISTRO_LIST_FAIL,
	REGISTRO_LIST_REQUEST,
	REGISTRO_LIST_SUCCESS,
	REGISTRO_UPDATE_REQUEST,
	REGISTRO_UPDATE_SUCCESS,
	REGISTRO_UPDATE_FAIL,
	REGISTRO_DELETE_REQUEST,
	REGISTRO_DELETE_FAIL,
	REGISTRO_DELETE_SUCCESS,
	REGISTRO_CATEGORY_LIST_SUCCESS,
	REGISTRO_CATEGORY_LIST_REQUEST,
	REGISTRO_CATEGORY_LIST_FAIL,
} from '../constants/registroConstants';

export const listRegistros =
	({ pageNumber = '', nombre = '', categoria = '' }) =>
	async (dispatch) => {
		dispatch({
			type: REGISTRO_LIST_REQUEST,
		});
		try {
			const { data } = await Axios.get(
				`/api/registros?pageNumber=${pageNumber}&nombre=${nombre}&categoria=${categoria}`
			);

			dispatch({ type: REGISTRO_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({ type: REGISTRO_LIST_FAIL, payload: error.message });
		}
	};

export const listRegistroCategories = () => async (dispatch) => {
	dispatch({
		type: REGISTRO_CATEGORY_LIST_REQUEST,
	});
	try {
		const { data } = await Axios.get(`/api/registros/categories`);
		dispatch({ type: REGISTRO_CATEGORY_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: REGISTRO_CATEGORY_LIST_FAIL, payload: error.message });
	}
};

export const detailsRegistro = (registroId) => async (dispatch) => {
	dispatch({ type: REGISTRO_DETAILS_REQUEST, payload: registroId });
	try {
		const { data } = await Axios.get(`/api/registros/${registroId}`);
		console.log('ACTIONS data registro:', data);
		dispatch({ type: REGISTRO_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: REGISTRO_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createRegistro =
	(
		fecha,
		referencia,
		beneficiario,
		tipodoc,
		categoria,
		descripcion,
		montobs,
		montousd,
		cambio,
		imageurl
	) =>
	async (dispatch, getState) => {
		dispatch({ type: REGISTRO_CREATE_REQUEST });
		console.log(fecha, beneficiario, referencia, 'imageurl', imageurl);
		const {
			userSignin: { userInfo },
		} = getState();
		try {
			const { data } = await Axios.post(
				'/api/registros/create',
				{
					fecha,
					referencia,
					beneficiario,
					tipodoc,
					categoria,
					descripcion,
					montobs,
					montousd,
					cambio,
					imageurl,
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);

			dispatch({
				type: REGISTRO_CREATE_SUCCESS,
				payload: data,
			});
		} catch (error) {
			const message =
				error.response && error.response.data.message
					? error.response.data.message
					: error.message;
			dispatch({ type: REGISTRO_CREATE_FAIL, payload: message });
		}
	};

export const updateRegistro = (registro) => async (dispatch, getState) => {
	dispatch({ type: REGISTRO_UPDATE_REQUEST, payload: registro });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = await Axios.put(
			`/api/registros/${registro._id}`,
			registro,
			{
				headers: { Authorization: `Bearer ${userInfo.token}` },
			}
		);
		dispatch({ type: REGISTRO_UPDATE_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: REGISTRO_UPDATE_FAIL, error: message });
	}
};

export const deleteRegistro = (registroId) => async (dispatch, getState) => {
	dispatch({ type: REGISTRO_DELETE_REQUEST, payload: registroId });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = Axios.delete(`/api/registros/${registroId}`, {
			headers: { Authorization: `Bearer ${userInfo.token}` },
		});

		dispatch({ type: REGISTRO_DELETE_SUCCESS });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: REGISTRO_DELETE_FAIL, payload: message });
	}
};
