import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import RegistroCreateScreen from './screens/RegistroCreateScreen';
import CartScreen from './screens/CartScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { signout } from './actions/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ClienteInfoScreen from './screens/ClienteInfoScreen';
import ClienteFastRegisterScreen from './screens/ClienteFastRegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';
import RegistroEditScreen from './screens/RegistroEditScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import ClienteRegisterScreen from './screens/ClienteRegisterScreen';
import ClienteListScreen from './screens/ClienteListScreen';
import ClienteEditScreen from './screens/ClienteEditScreen';
import ProveedorListScreen from './screens/ProveedorListScreen';
import ProveedorEditScreen from './screens/ProveedorEditScreen';
import ProveedorRegisterScreen from './screens/ProveedorRegisterScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faTools,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import Tooltip from './components/Tooltip';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CambioDiaScreen from './screens/CambioDiaScreen';
import DashboardScreen from './screens/DashboardScreen';
import RegistroListScreen from './screens/RegistroListScreen';

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
						<Link className='brand' to='/'>
							<FontAwesomeIcon icon={faTools} />
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
							path='/registro/:id/edit'
							element={<RegistroEditScreen />}
							exact
						></Route>

						<Route path='/signin' element={<SigninScreen />}></Route>

						<Route path='/clienteinfo' element={<ClienteInfoScreen />}></Route>
						<Route
							path='/clientefastregister'
							element={<ClienteFastRegisterScreen />}
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
							path='/registrolist'
							element={
								<AdminRoute>
									<RegistroListScreen />
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
							path='/createregistro'
							element={
								<AdminRoute>
									<RegistroCreateScreen />
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
				<footer className='row center'>DeModa 11mayo2022</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
