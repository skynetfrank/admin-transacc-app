import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen(props) {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const userRegister = useSelector(state => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Su confirmacion de Password no coincide... verifique!');
    } else {
      dispatch(register(nombre, email, apellido, cedula, password, telefono));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div>
      <form className="form registro" onSubmit={submitHandler}>
        <div>
          <h1>Crear Usuario</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}

        <div>
          <label htmlFor="name">Nombre</label>
          <input type="text" id="nombre" required onChange={e => setNombre(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="apellido">Apellido</label>
          <input type="text" id="apellido" required onChange={e => setApellido(e.target.value)}></input>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required onChange={e => setEmail(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required onChange={e => setPassword(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirme su Password</label>
          <input
            type="password"
            id="confirmPassword"
            required
            onChange={e => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="cedula">Cedula de Identidad</label>
          <input type="text" id="cedula" required onChange={e => setCedula(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="telefono">Telefono</label>
          <input type="text" id="telefono" required onChange={e => setTelefono(e.target.value)}></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Registrar Usuario
          </button>
        </div>
        <div>
          <label />
          <div>
            Ya tienes Cuenta? <Link to={`/signin?redirect=${redirect}`}>Inicia Sesion Aqui</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
