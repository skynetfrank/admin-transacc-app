const {
	REGISTRO_LIST_REQUEST,
	REGISTRO_LIST_SUCCESS,
	REGISTRO_LIST_FAIL,
	REGISTRO_DETAILS_REQUEST,
	REGISTRO_DETAILS_SUCCESS,
	REGISTRO_DETAILS_FAIL,
	REGISTRO_CREATE_REQUEST,
	REGISTRO_CREATE_SUCCESS,
	REGISTRO_CREATE_FAIL,
	REGISTRO_CREATE_RESET,
	REGISTRO_UPDATE_REQUEST,
	REGISTRO_UPDATE_SUCCESS,
	REGISTRO_UPDATE_FAIL,
	REGISTRO_UPDATE_RESET,
	REGISTRO_DELETE_REQUEST,
	REGISTRO_DELETE_SUCCESS,
	REGISTRO_DELETE_FAIL,
	REGISTRO_DELETE_RESET,
	REGISTRO_CATEGORY_LIST_REQUEST,
	REGISTRO_CATEGORY_LIST_SUCCESS,
	REGISTRO_CATEGORY_LIST_FAIL,
} = require('../constants/registroConstants');

export const registroCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case REGISTRO_CREATE_REQUEST:
			return { loading: true };
		case REGISTRO_CREATE_SUCCESS:
			return { loading: false, success: true, registro: action.payload };
		case REGISTRO_CREATE_FAIL:
			return { loading: false, error: action.payload };
		case REGISTRO_CREATE_RESET:
			return {};
		default:
			return state;
	}
};

export const registroListReducer = (
	state = { loading: true, registros: [] },
	action
) => {
	switch (action.type) {
		case REGISTRO_LIST_REQUEST:
			return { loading: true };
		case REGISTRO_LIST_SUCCESS:
			return {
				loading: false,
				registros: action.payload.registros,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case REGISTRO_LIST_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const registroCategoryListReducer = (
	state = { loading: true, registroos: [] },
	action
) => {
	switch (action.type) {
		case REGISTRO_CATEGORY_LIST_REQUEST:
			return { loading: true };
		case REGISTRO_CATEGORY_LIST_SUCCESS:
			return { loading: false, categories: action.payload };
		case REGISTRO_CATEGORY_LIST_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const registroDetailsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case REGISTRO_DETAILS_REQUEST:
			return { loading: true };
		case REGISTRO_DETAILS_SUCCESS:
			return { loading: false, registro: action.payload };
		case REGISTRO_DETAILS_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const registroUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case REGISTRO_UPDATE_REQUEST:
			return { loading: true };
		case REGISTRO_UPDATE_SUCCESS:
			return { loading: false, success: true };
		case REGISTRO_UPDATE_FAIL:
			return { loading: false, error: action.payload };
		case REGISTRO_UPDATE_RESET:
			return {};
		default:
			return state;
	}
};
export const registroDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case REGISTRO_DELETE_REQUEST:
			return { loading: true };
		case REGISTRO_DELETE_SUCCESS:
			return { loading: false, success: true };
		case REGISTRO_DELETE_FAIL:
			return { loading: false, error: action.payload };
		case REGISTRO_DELETE_RESET:
			return {};
		default:
			return state;
	}
};
