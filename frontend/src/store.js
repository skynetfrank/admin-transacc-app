import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import {
	registroCategoryListReducer,
	registroCreateReducer,
	registroDeleteReducer,
	registroDetailsReducer,
	registroListReducer,
	registroUpdateReducer,
	getRegistrobyCodeReducer,
} from './reducers/registroReducers';

import {
	proveedorDeleteReducer,
	proveedorDetailsReducer,
	proveedorListReducer,
	proveedorRegisterReducer,
	proveedorUpdateProfileReducer,
} from './reducers/proveedorReducers';
import {
	clienteDeleteReducer,
	clienteDetailsReducer,
	clienteListReducer,
	clienteRegisterReducer,
	clienteUpdateProfileReducer,
	clienteGetByRifReducer,
} from './reducers/clienteReducers';
import {
	orderCreateReducer,
	orderDeleteReducer,
	orderDeliverReducer,
	orderDetailsReducer,
	orderListReducer,
	orderMineListReducer,
	orderPayconfirmReducer,
	orderPayReducer,
	orderSummaryReducer,
} from './reducers/orderReducers';

import {
	userAddressMapReducer,
	userDeleteReducer,
	userDetailsReducer,
	userListReducer,
	userRegisterReducer,
	userSigninReducer,
	userTopSellerListReducer,
	userUpdateProfileReducer,
	userUpdateReducer,
} from './reducers/userReducers';

import {
	settingsDetailsReducer,
	settingsListReducer,
	settingsUpdateReducer,
} from './reducers/settingsReducers';

const initialState = {
	userSignin: {
		userInfo: localStorage.getItem('userInfo')
			? JSON.parse(localStorage.getItem('userInfo'))
			: null,
	},
	cart: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems'))
			: [],
	},
};

const reducer = combineReducers({
	registroList: registroListReducer,
	registroDetails: registroDetailsReducer,
	registroCreate: registroCreateReducer,
	registroUpdate: registroUpdateReducer,
	registroDelete: registroDeleteReducer,
	registrobyCode: getRegistrobyCodeReducer,
	registroCategoryList: registroCategoryListReducer,

	cart: cartReducer,

	userSignin: userSigninReducer,
	userRegister: userRegisterReducer,
	clienteRegister: clienteRegisterReducer,
	proveedorRegister: proveedorRegisterReducer,
	clienteByRif: clienteGetByRifReducer,
	userDetails: userDetailsReducer,
	clienteDetails: clienteDetailsReducer,
	proveedorDetails: proveedorDetailsReducer,
	userUpdateProfile: userUpdateProfileReducer,
	clienteUpdateProfile: clienteUpdateProfileReducer,
	proveedorUpdateProfile: proveedorUpdateProfileReducer,
	userUpdate: userUpdateReducer,

	orderCreate: orderCreateReducer,
	orderDetails: orderDetailsReducer,
	orderPay: orderPayReducer,
	orderPayconfirm: orderPayconfirmReducer,
	orderMineList: orderMineListReducer,
	orderList: orderListReducer,
	orderDelete: orderDeleteReducer,
	orderDeliver: orderDeliverReducer,
	orderSummary: orderSummaryReducer,

	userList: userListReducer,
	clienteList: clienteListReducer,
	proveedorList: proveedorListReducer,
	userDelete: userDeleteReducer,
	clienteDelete: clienteDeleteReducer,
	proveedorDelete: proveedorDeleteReducer,
	userTopSellersList: userTopSellerListReducer,

	userAddressMap: userAddressMapReducer,
	settingsUpdate: settingsUpdateReducer,
	settingsList: settingsListReducer,
	settingsDetails: settingsDetailsReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	reducer,
	initialState,
	composeEnhancer(applyMiddleware(thunk))
);

export default store;
