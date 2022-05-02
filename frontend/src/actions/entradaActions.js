import Axios from 'axios';
import { MOV_EMPTY } from '../constants/movConstants';
import {
	ENTRADA_CREATE_FAIL,
	ENTRADA_CREATE_REQUEST,
	ENTRADA_CREATE_SUCCESS,
	ENTRADA_DETAILS_FAIL,
	ENTRADA_DETAILS_REQUEST,
	ENTRADA_DETAILS_SUCCESS,
	ENTRADA_PAY_REQUEST,
	ENTRADA_PAY_FAIL,
	ENTRADA_PAY_SUCCESS,
	ENTRADA_MINE_LIST_REQUEST,
	ENTRADA_MINE_LIST_FAIL,
	ENTRADA_MINE_LIST_SUCCESS,
	ENTRADA_LIST_REQUEST,
	ENTRADA_LIST_SUCCESS,
	ENTRADA_LIST_FAIL,
	ENTRADA_DELETE_REQUEST,
	ENTRADA_DELETE_SUCCESS,
	ENTRADA_DELETE_FAIL,
	ENTRADA_DELIVER_REQUEST,
	ENTRADA_DELIVER_SUCCESS,
	ENTRADA_DELIVER_FAIL,
	ENTRADA_SUMMARY_REQUEST,
	ENTRADA_SUMMARY_SUCCESS,
	ENTRADA_PAYCONFIRM_REQUEST,
	ENTRADA_PAYCONFIRM_SUCCESS,
	ENTRADA_PAYCONFIRM_FAIL,
} from '../constants/entradaConstants';
import { updateExistencia } from '../actions/productActions';

export const createEntrada = (entrada) => async (dispatch, getState) => {
	console.log('ACTIONS ENTRADA: objeto entrada:', entrada);
	dispatch({ type: ENTRADA_CREATE_REQUEST, payload: entrada });
	try {
		const {
			userSignin: { userInfo },
		} = getState();
		const { data } = await Axios.post('/api/entradas', entrada, {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		});
		dispatch({ type: ENTRADA_CREATE_SUCCESS, payload: data.entrada });
		const items = data.entrada.entradaItems;
		items.forEach((item) => {
			const idProducto = item.producto;
			const cantidad = item.qty;
			const movimiento = 'entrada';
			dispatch(updateExistencia({ idProducto, cantidad, movimiento }));
		});

		dispatch({ type: MOV_EMPTY });
		localStorage.removeItem('movItems');
	} catch (error) {
		dispatch({
			type: ENTRADA_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const detailsEntrada = (entradaId) => async (dispatch, getState) => {
	dispatch({ type: ENTRADA_DETAILS_REQUEST, payload: entradaId });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = await Axios.get(`/api/entradas/${entradaId}`, {
			headers: { Authorization: `Bearer ${userInfo.token}` },
		});
		dispatch({ type: ENTRADA_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: ENTRADA_DETAILS_FAIL, payload: message });
	}
};

export const payEntrada =
	(entrada, paymentResult) => async (dispatch, getState) => {
		dispatch({
			type: ENTRADA_PAY_REQUEST,
			payload: { entrada, paymentResult },
		});
		const {
			userSignin: { userInfo },
		} = getState();
		try {
			const { data } = Axios.put(
				`/api/entradas/${entrada._id}/pay`,
				paymentResult,
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);
			dispatch({ type: ENTRADA_PAY_SUCCESS, payload: data });
		} catch (error) {
			const message =
				error.response && error.response.data.message
					? error.response.data.message
					: error.message;
			dispatch({ type: ENTRADA_PAY_FAIL, payload: message });
		}
	};
export const listEntradaMine = () => async (dispatch, getState) => {
	dispatch({ type: ENTRADA_MINE_LIST_REQUEST });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = await Axios.get('/api/entradas/mine', {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		});
		dispatch({ type: ENTRADA_MINE_LIST_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: ENTRADA_MINE_LIST_FAIL, payload: message });
	}
};
export const listEntradas =
	({ seller = '' }) =>
	async (dispatch, getState) => {
		dispatch({ type: ENTRADA_LIST_REQUEST });
		const {
			userSignin: { userInfo },
		} = getState();
		try {
			const { data } = await Axios.get(`/api/entradas?seller=${seller}`, {
				headers: { Authorization: `Bearer ${userInfo.token}` },
			});
			dispatch({ type: ENTRADA_LIST_SUCCESS, payload: data });
		} catch (error) {
			const message =
				error.response && error.response.data.message
					? error.response.data.message
					: error.message;
			dispatch({ type: ENTRADA_LIST_FAIL, payload: message });
		}
	};
export const deleteEntrada = (entradaId) => async (dispatch, getState) => {
	dispatch({ type: ENTRADA_DELETE_REQUEST, payload: entradaId });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = Axios.delete(`/api/entradas/${entradaId}`, {
			headers: { Authorization: `Bearer ${userInfo.token}` },
		});
		dispatch({ type: ENTRADA_DELETE_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: ENTRADA_DELETE_FAIL, payload: message });
	}
};

export const deliverEntrada = (entradaId) => async (dispatch, getState) => {
	dispatch({ type: ENTRADA_DELIVER_REQUEST, payload: entradaId });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = Axios.put(
			`/api/entradas/${entradaId}/deliver`,
			{},
			{
				headers: { Authorization: `Bearer ${userInfo.token}` },
			}
		);
		dispatch({ type: ENTRADA_DELIVER_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: ENTRADA_DELIVER_FAIL, payload: message });
	}
};

export const summaryEntrada = () => async (dispatch, getState) => {
	dispatch({ type: ENTRADA_SUMMARY_REQUEST });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = await Axios.get('/api/entradas/summary', {
			headers: { Authorization: `Bearer ${userInfo.token}` },
		});
		dispatch({ type: ENTRADA_SUMMARY_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: ENTRADA_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const payconfirmEntrada = (entradaId) => async (dispatch, getState) => {
	dispatch({ type: ENTRADA_PAYCONFIRM_REQUEST, payload: entradaId });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = Axios.put(
			`/api/entradas/${entradaId}/payconfirm`,
			{},
			{ headers: { Authorization: `Bearer ${userInfo.token}` } }
		);
		dispatch({ type: ENTRADA_PAYCONFIRM_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: ENTRADA_PAYCONFIRM_FAIL, payload: message });
	}
};
