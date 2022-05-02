import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerCliente } from '../actions/clienteActions';
import { CLIENTE_REGISTER_RESET } from '../constants/clienteConstants';
import NumberFormat from 'react-number-format';

export default function RegisterScreen(props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rif, setRif] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [telefono, setTelefono] = useState('');
  const [condiciones, setCondiciones] = useState('contado');
  const [prontopago, setProntopago] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [contacto, setContacto] = useState('-');
  const [isTaller, setIsTaller] = useState(false);

  const { search } = useLocation();
  const rifInUrl = new URLSearchParams(search).get('rif');

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const clienteRegister = useSelector(state => state.clienteRegister);
  const { clienteInfo, error } = clienteRegister;
  const dispatch = useDispatch();

  const conditions = ['Contado', 'Credito'];

  useEffect(() => {
    if (rifInUrl) {
      setRif(rifInUrl);
    }
  }, []);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      registerCliente(
        nombre,
        email,
        rif,
        direccion,
        celular,
        telefono,
        isTaller,
        condiciones,
        prontopago,
        descuento,
        contacto
      )
    );
  };

  useEffect(() => {
    if (clienteInfo) {
      toast.success('Cliente Registrado O.K.!', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: CLIENTE_REGISTER_RESET });
      setNombre('');
      setEmail('');
      setRif('');
      setDireccion('');
      setCelular('');
      setTelefono('');
      setCondiciones('');
      setProntopago('');
      setDescuento('');
      setContacto('-');
      setIsTaller(false);
    }
  }, [clienteInfo, dispatch]);

  useEffect(() => {
    if (error) {
      toast.success('Error: Verifique el RIF y el EMAIL (podrian estar duplicados)', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: CLIENTE_REGISTER_RESET });
    }
  });

  return (
    <div>
      <Link to="/clientelist" className="back-link">
        volver a Clientes
      </Link>
      <form className="form registro clientes" onSubmit={submitHandler}>
        <div>
          <h1>Agregar Clientes</h1>
        </div>
        <div className="input__div">
          <input
            type="text"
            pattern="[V|J|G][0-9]{9}"
            id="rif"
            value={rif}
            required
            onChange={e => setRif(e.target.value)}
            maxLength={10}
          ></input>
          <label htmlFor="rif">R.I.F.</label>
        </div>

        <div className="input__div">
          <input
            type="text"
            id="nombre-cliente"
            value={nombre}
            required
            maxLength={50}
            onChange={e => setNombre(e.target.value)}
          ></input>
          <label htmlFor="name">Nombre o Razon Social</label>
        </div>

        <div className="input__div">
          <input
            type="text"
            id="direccion"
            value={direccion}
            required
            maxLength={80}
            onChange={e => setDireccion(e.target.value)}
          ></input>
          <label htmlFor="direccion">Direccion Fiscal</label>
        </div>
        <div className="input__div">
          <NumberFormat
            format="####-###-##-##"
            allowEmptyFormatting
            mask="_"
            type="text"
            id="celular"
            value={celular}
            onChange={e => setCelular(e.target.value)}
          />
          <label htmlFor="celular">Celular</label>
        </div>

        <div className="input__div">
          <NumberFormat
            format="####-###-##-##"
            allowEmptyFormatting
            mask="_"
            type="text"
            id="telefono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
          />
          <label htmlFor="celular">Telefono</label>
        </div>

        <div className="input__div">
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)}></input>
          <label htmlFor="email">Email</label>
        </div>

        <div className="inline-check">
          <label htmlFor="isTaller">El Cliente es un Taller?</label>
          <input
            id="isTaller"
            type="checkbox"
            value={isTaller}
            checked={isTaller}
            onChange={e => setIsTaller(e.target.checked)}
          ></input>
        </div>

        <div className="inline-inputs">
          <div>
            <label>Condiciones</label>
            <select className="inline-select" value={condiciones} onChange={e => setCondiciones(e.target.value)}>
              {conditions.map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>% Pronto Pago</label>
            <select className="inline-select" value={prontopago} onChange={e => setProntopago(e.target.value)}>
              {[...Array(12).keys()].map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>% Descuento</label>
            <select className="inline-select" value={descuento} onChange={e => setDescuento(e.target.value)}>
              {[...Array(12).keys()].map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input__div">
          <input
            type="text"
            id="contacto"
            value={contacto}
            required
            onChange={e => setContacto(e.target.value)}
          ></input>
          <label htmlFor="contacto">Contacto</label>
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Registrar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}
