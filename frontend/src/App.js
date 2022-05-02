import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import logo from './lacima.png';
import CartScreen from './screens/CartScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { signout } from './actions/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import ClienteInfoScreen from './screens/ClienteInfoScreen';
import ClienteFastRegisterScreen from './screens/ClienteFastRegisterScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import PlaceCotizacionScreen from './screens/PlaceCotizacionScreen';
import CotizacionScreen from './screens/CotizacionScreen';
import OrderScreen from './screens/OrderScreen';
import PrintOrderScreen from './screens/PrintOrderScreen';
import PrintCotizacionScreen from './screens/PrintCotizacionScreen';
import EntradaView from './screens/EntradaView';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import EntradaListScreen from './screens/EntradaListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import ProductListScreen from './screens/ProductListScreen';
import ClienteRegisterScreen from './screens/ClienteRegisterScreen';
import ClienteListScreen from './screens/ClienteListScreen';
import ClienteEditScreen from './screens/ClienteEditScreen';
import ProveedorListScreen from './screens/ProveedorListScreen';
import ProveedorEditScreen from './screens/ProveedorEditScreen';
import ProveedorRegisterScreen from './screens/ProveedorRegisterScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faCartArrowDown,
	faUser,
	faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import Tooltip from './components/Tooltip';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCreateScreen from './screens/ProductCreateScreen';
import NotaEntradaScreen from './screens/NotaEntradaScreen';
import CambioDiaScreen from './screens/CambioDiaScreen';
import CotizacionListScreen from './screens/CotizacionListScreen';
import DashboardScreen from './screens/DashboardScreen';

/* 
 <Tooltip position="left" content="Carrito de Compras">
  
 </Tooltip>

 */

function App() {
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;
	const dispatch = useDispatch();
	const signoutHandler = () => {
		dispatch(signout());
	};

	return (
		<BrowserRouter>
			<div className='grid-container'>
				<header className='row'>
					<div className='row'>
						<Link to='/'>
							<img className='logo' src={logo} alt='logo' />
						</Link>
						<Link className='brand' to='/'>
							Transacc-App
						</Link>
					</div>
					<div className='row'>
						{userInfo ? (
							<div className='dropdown'>
								<Link className='link-usuario' to='#'>
									{userInfo.nombre.substr(0, 12)}
									<FontAwesomeIcon icon={faCaretDown} />
								</Link>
								<ul className='dropdown-content'>
									<li>
										<Link to='/profile'>Mi Perfil</Link>
									</li>
									<li>
										<Link to='/orderhistory'>Mis Pedidos</Link>
									</li>
									<li>
										<Link to='#signout' onClick={signoutHandler}>
											Cerrar Sesion
										</Link>
									</li>
								</ul>
							</div>
						) : (
							<Link to='/signin'>
								<Tooltip position='left' content='Iniciar Sesion'>
									<FontAwesomeIcon icon={faUser} />
								</Tooltip>
							</Link>
						)}

						{userInfo && userInfo.isAdmin && (
							<Link to='/administrador'>
								<Tooltip position='left' content='Administrador'>
									<FontAwesomeIcon icon={faUserShield} />
								</Tooltip>
							</Link>
						)}
						{userInfo && userInfo.isVendedor && (
							<FontAwesomeIcon icon={faUserCog} />
						)}
						<Link to='/cart'>
							<Tooltip position='left' content='Pedido Actual'>
								<FontAwesomeIcon icon={faCartArrowDown} />
							</Tooltip>
							{cartItems.length > 0 && (
								<span className='badge'>{cartItems.length}</span>
							)}
						</Link>
					</div>
				</header>
				<main>
					<ToastContainer limit={1} />
					<Routes>
						<Route path='/administrador' element={<AdminScreen />}></Route>
						<Route path='/dashboard' element={<DashboardScreen />}></Route>
						<Route path='/cart' element={<CartScreen />}></Route>
						<Route path='/cart/:id' element={<CartScreen />}></Route>
						<Route
							path='/product/:id'
							element={<ProductScreen />}
							exact
						></Route>
						<Route
							path='/product/:id/edit'
							element={<ProductEditScreen />}
							exact
						></Route>
						<Route path='/entrada' element={<NotaEntradaScreen />}></Route>
						<Route path='/signin' element={<SigninScreen />}></Route>
						<Route path='/shipping' element={<ShippingAddressScreen />}></Route>
						<Route path='/clienteinfo' element={<ClienteInfoScreen />}></Route>
						<Route
							path='/clientefastregister'
							element={<ClienteFastRegisterScreen />}
						></Route>
						<Route path='/payment' element={<PaymentMethodScreen />}></Route>
						<Route path='/placeorder' element={<PlaceOrderScreen />}></Route>
						<Route
							path='/placecotizacion'
							element={<PlaceCotizacionScreen />}
						></Route>
						<Route path='/order/:id' element={<OrderScreen />}></Route>
						<Route
							path='/printorder/:id'
							element={<PrintOrderScreen />}
							exact
						></Route>
						<Route
							path='/cotizacion/:id'
							element={<CotizacionScreen />}
						></Route>
						<Route
							path='/printcotizacion/:id'
							element={<PrintCotizacionScreen />}
							exact
						></Route>
						<Route path='/entrada/:id' element={<EntradaView />}></Route>
						<Route
							path='/orderhistory'
							element={<OrderHistoryScreen />}
						></Route>

						<Route path='/register' element={<RegisterScreen />}></Route>

						<Route
							path='/profile'
							element={
								<PrivateRoute>
									<ProfileScreen />
								</PrivateRoute>
							}
						/>
						<Route
							path='/productlist'
							element={
								<AdminRoute>
									<ProductListScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/clientelist'
							element={
								<AdminRoute>
									<ClienteListScreen />
								</AdminRoute>
							}
							exact
						/>
						<Route
							path='/proveedorlist'
							element={
								<AdminRoute>
									<ProveedorListScreen />
								</AdminRoute>
							}
							exact
						/>
						<Route
							path='/createproduct'
							element={
								<AdminRoute>
									<ProductCreateScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/settings/:id'
							element={
								<AdminRoute>
									<CambioDiaScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/registrarcliente'
							element={
								<AdminRoute>
									<ClienteRegisterScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/registrarproveedor'
							element={
								<AdminRoute>
									<ProveedorRegisterScreen />
								</AdminRoute>
							}
							exact
						/>
						<Route
							path='/productlist/pageNumber/:pageNumber'
							element={
								<AdminRoute>
									<ProductListScreen />
								</AdminRoute>
							}
							exact
						/>
						<Route
							path='/orderlist'
							element={
								<AdminRoute>
									<OrderListScreen />
								</AdminRoute>
							}
						/>

						<Route
							path='/orderlist/pageNumber/:pageNumber'
							element={
								<AdminRoute>
									<OrderListScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/cotizacionlist'
							element={
								<AdminRoute>
									<CotizacionListScreen />
								</AdminRoute>
							}
						/>

						<Route
							path='/cotizacionlist/pageNumber/:pageNumber'
							element={
								<AdminRoute>
									<CotizacionListScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/entradalist'
							element={
								<AdminRoute>
									<EntradaListScreen />
								</AdminRoute>
							}
						/>
						<Route
							path='/userlist'
							element={
								<AdminRoute>
									<UserListScreen />
								</AdminRoute>
							}
						/>
						<Route
							path='/userlist/pageNumber/:pageNumber'
							element={
								<AdminRoute>
									<UserListScreen />
								</AdminRoute>
							}
							exact
						/>

						<Route
							path='/user/:id/edit'
							element={
								<AdminRoute>
									<UserEditScreen />
								</AdminRoute>
							}
						/>
						<Route
							path='/cliente/:id/edit'
							element={
								<AdminRoute>
									<ClienteEditScreen />
								</AdminRoute>
							}
						/>
						<Route
							path='/proveedor/:id/edit'
							element={
								<AdminRoute>
									<ProveedorEditScreen />
								</AdminRoute>
							}
						/>

						<Route
							path='/pageNumber/:pageNumber'
							element={<HomeScreen />}
							exact
						></Route>
						<Route path='/' element={<HomeScreen />} exact></Route>
					</Routes>
				</main>
				<footer className='row center'>LaCima-Stock - v1.0 01mayo2022</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
