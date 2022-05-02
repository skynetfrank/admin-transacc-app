import {
	COTIZACION_CREATE_FAIL,
	COTIZACION_CREATE_REQUEST,
	COTIZACION_CREATE_RESET,
	COTIZACION_CREATE_SUCCESS,
	COTIZACION_DETAILS_FAIL,
	COTIZACION_DETAILS_REQUEST,
	COTIZACION_DETAILS_SUCCESS,
	COTIZACION_MINE_LIST_FAIL,
	COTIZACION_MINE_LIST_REQUEST,
	COTIZACION_MINE_LIST_SUCCESS,
	COTIZACION_PAY_FAIL,
	COTIZACION_PAY_REQUEST,
	COTIZACION_PAY_RESET,
	COTIZACION_PAY_SUCCESS,
	COTIZACION_LIST_REQUEST,
	COTIZACION_LIST_SUCCESS,
	COTIZACION_LIST_FAIL,
	COTIZACION_DELETE_REQUEST,
	COTIZACION_DELETE_SUCCESS,
	COTIZACION_DELETE_FAIL,
	COTIZACION_DELETE_RESET,
	COTIZACION_DELIVER_REQUEST,
	COTIZACION_DELIVER_SUCCESS,
	COTIZACION_DELIVER_FAIL,
	COTIZACION_DELIVER_RESET,
	COTIZACION_SUMMARY_REQUEST,
	COTIZACION_SUMMARY_SUCCESS,
	COTIZACION_SUMMARY_FAIL,
	COTIZACION_PAYCONFIRM_REQUEST,
	COTIZACION_PAYCONFIRM_SUCCESS,
	COTIZACION_PAYCONFIRM_FAIL,
	COTIZACION_PAYCONFIRM_RESET,
} from '../constants/cotizacionConstants';

export const cotizacionCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case COTIZACION_CREATE_REQUEST:
			return { loading: true };
		case COTIZACION_CREATE_SUCCESS:
			return { loading: false, success: true, cotizacion: action.payload };
		case COTIZACION_CREATE_FAIL:
			return { loading: false, error: action.payload };
		case COTIZACION_CREATE_RESET:
			return {};
		default:
			return state;
	}
};

export const cotizacionDetailsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case COTIZACION_DETAILS_REQUEST:
			return { loading: true };
		case COTIZACION_DETAILS_SUCCESS:
			return { loading: false, cotizacion: action.payload };
		case COTIZACION_DETAILS_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const cotizacionMineListReducer = (
	state = { cotizaciones: [] },
	action
) => {
	switch (action.type) {
		case COTIZACION_MINE_LIST_REQUEST:
			return { loading: true };
		case COTIZACION_MINE_LIST_SUCCESS:
			return { loading: false, cotizaciones: action.payload };
		case COTIZACION_MINE_LIST_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};
export const cotizacionListReducer = (state = { cotizaciones: [] }, action) => {
	switch (action.type) {
		case COTIZACION_LIST_REQUEST:
			return { loading: true };
		case COTIZACION_LIST_SUCCESS:
			return {
				loading: false,
				cotizaciones: action.payload.cotizaciones,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case COTIZACION_LIST_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};
export const cotizacionDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case COTIZACION_DELETE_REQUEST:
			return { loading: true };
		case COTIZACION_DELETE_SUCCESS:
			return { loading: false, success: true };
		case COTIZACION_DELETE_FAIL:
			return { loading: false, error: action.payload };
		case COTIZACION_DELETE_RESET:
			return {};
		default:
			return state;
	}
};

export const cotizacionSummaryReducer = (
	state = { loading: true, summary: {} },
	action
) => {
	switch (action.type) {
		case COTIZACION_SUMMARY_REQUEST:
			return { loading: true };
		case COTIZACION_SUMMARY_SUCCESS:
			return { loading: false, summary: action.payload };
		case COTIZACION_SUMMARY_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};
