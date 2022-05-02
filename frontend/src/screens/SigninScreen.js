import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';

export default function SigninScreen(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();
  const submitHandler = e => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Iniciar Sesion</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required onChange={e => setEmail(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required onChange={e => setPassword(e.target.value)}></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Entrar
          </button>
        </div>
        <div>
          <label />
          <div>
            No tienes cuenta? <Link to={`/register?redirect=${redirect}`}>Registrate!</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
