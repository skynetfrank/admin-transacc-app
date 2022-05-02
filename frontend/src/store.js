import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
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
  productCategoryListReducer,
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productReviewCreateReducer,
  productUpdateReducer,
  productUpdateExistenciaReducer,
  getProductbyCodeReducer,
} from './reducers/productReducers';
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
import { movReducer } from './reducers/movReducers';

import {
  entradaCreateReducer,
  entradaDetailsReducer,
  entradaPayReducer,
  entradaPayconfirmReducer,
  entradaMineListReducer,
  entradaListReducer,
  entradaDeleteReducer,
  entradaDeliverReducer,
  entradaSummaryReducer,
} from './reducers/entradaReducers';
import {
  cotizacionCreateReducer,
  cotizacionDeleteReducer,
  cotizacionDetailsReducer,
  cotizacionListReducer,
  cotizacionMineListReducer,
  cotizacionSummaryReducer,
} from './reducers/cotizacionReducers';
import { settingsDetailsReducer, settingsListReducer, settingsUpdateReducer } from './reducers/settingsReducers';

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  },
  cart: {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    clienteInfo: localStorage.getItem('clienteInfo') ? JSON.parse(localStorage.getItem('clienteInfo')) : [],
    vendedorInfo: localStorage.getItem('vendedorInfo') ? JSON.parse(localStorage.getItem('vendedorInfo')) : [],
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
    adminCambioDia: localStorage.getItem('adminCambioDia') ? JSON.parse(localStorage.getItem('adminCambioDia')) : {},
  },
  mov: {
    movItems: localStorage.getItem('movItems') ? JSON.parse(localStorage.getItem('movItems')) : [],
  },
};

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  mov: movReducer,
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
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  productbyCode: getProductbyCodeReducer,
  productUpdateExistencia: productUpdateExistenciaReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderPayconfirm: orderPayconfirmReducer,
  orderMineList: orderMineListReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
  orderDeliver: orderDeliverReducer,
  orderSummary: orderSummaryReducer,

  cotizacionCreate: cotizacionCreateReducer,
  cotizacionDetails: cotizacionDetailsReducer,
  cotizacionMineList: cotizacionMineListReducer,
  cotizacionList: cotizacionListReducer,
  cotizacionDelete: cotizacionDeleteReducer,
  cotizacionSummary: cotizacionSummaryReducer,

  entradaCreate: entradaCreateReducer,
  entradaDetails: entradaDetailsReducer,
  entradaPay: entradaPayReducer,
  entradaPayconfirm: entradaPayconfirmReducer,
  entradaMineList: entradaMineListReducer,
  entradaList: entradaListReducer,
  entradaDelete: entradaDeleteReducer,
  entradaDeliver: entradaDeliverReducer,
  entradaSummary: entradaSummaryReducer,

  userList: userListReducer,
  clienteList: clienteListReducer,
  proveedorList: proveedorListReducer,
  userDelete: userDeleteReducer,
  clienteDelete: clienteDeleteReducer,
  proveedorDelete: proveedorDeleteReducer,
  userTopSellersList: userTopSellerListReducer,
  productCategoryList: productCategoryListReducer,
  productReviewCreate: productReviewCreateReducer,
  userAddressMap: userAddressMapReducer,
  settingsUpdate: settingsUpdateReducer,
  settingsList: settingsListReducer,
  settingsDetails: settingsDetailsReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
