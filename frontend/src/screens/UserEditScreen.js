import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserEditScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id: userId } = params;
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVendedor, setIsVendedor] = useState(false);

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/userlist');
    }
    if (!user) {
      dispatch(detailsUser(userId));
    } else {
      setNombre(user.nombre);
      setApellido(user.apellido);
      setEmail(user.email);
      setIsVendedor(user.isVendedor);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, navigate, successUpdate, user, userId]);

  const submitHandler = e => {
    e.preventDefault();
    // dispatch update user
    dispatch(updateUser({ _id: userId, nombre, apellido, email, isVendedor, isAdmin }));
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Editar Usuario</h1>
          {loadingUpdate && <LoadingBox></LoadingBox>}
          {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        </div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)}></input>
            </div>
            <div>
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" type="text" value={apellido} onChange={e => setApellido(e.target.value)}></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="isAdmin">Es Administrador?</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
              ></input>
            </div>
            <div>
              <label htmlFor="isVendedor">Es Vendedor?</label>
              <input
                id="isVendedor"
                type="checkbox"
                checked={isVendedor}
                onChange={e => setIsVendedor(e.target.checked)}
              ></input>
            </div>
            <div>
              <button type="submit" className="primary">
                Actualizar
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
