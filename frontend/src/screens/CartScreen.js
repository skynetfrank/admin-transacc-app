import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';

export default function CartScreen(props) {
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const navigate = useNavigate();
  //const myurl = queryString.parse(props.location.search);
  const params = useParams();
  const { id: productId } = params;

  const { search } = useLocation();
  const qtyInUrl = new URLSearchParams(search).get('qty');
  const qty = qtyInUrl ? Number(qtyInUrl) : 1;

  const cart = useSelector(state => state.cart);

  const { cartItems, error } = cart;
  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
    //navigate('/cart');
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = id => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo.isVendedor || userInfo.isAdmin) {
      navigate('/signin?redirect=/clienteinfo');
    } else {
      navigate('/signin?redirect=/shipping');
    }
  };

  return (
    <div className="row top">
      <div className="col-2 cart">
        <h1>Tu Pedido</h1>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {cartItems.length === 0 ? (
          <MessageBox>
            Tu Pedido esta vacio. <Link to="/">ir a Productos</Link>
          </MessageBox>
        ) : (
          <ul className="carrito-ul">
            {cartItems.map((item, index) => (
              <li key={item.producto + index}>
                <div className="row shadow">
                  <div>
                    <img src={item.imageurl} alt="foto" className="small"></img>
                  </div>

                  <div className="min-30 nombre-producto">
                    <Link to={`/product/${item.producto}`}>
                      {item.nombre} ({item.ubicacion})
                    </Link>
                    <p id="mini-descripcion">{item.descripcion}</p>
                  </div>

                  <div className="cart-item-cant">
                    <select value={item.qty} onChange={e => dispatch(addToCart(item.producto, Number(e.target.value)))}>
                      {[...Array(item.existencia).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="cart-item-precio">${item.precio}</div>
                  <div>
                    <FontAwesomeIcon icon={faTrashAlt} onClick={() => removeFromCartHandler(item.producto)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card resumen">
          <div className="row center">
            <h1>Resumen</h1>
          </div>
          <ul>
            <li className="row">
              <h2 className="cart-subtotal">Total ({cartItems.reduce((a, c) => a + c.qty, 0)} articulos):</h2>
              <h2>${cartItems.reduce((a, c) => a + c.precio * c.qty, 0).toFixed(2)}</h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                className="primary block"
                disabled={cartItems.length === 0}
              >
                Comprar
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
