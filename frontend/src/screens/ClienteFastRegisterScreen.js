import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveClienteInfo, saveShippingAddress, saveVendedorInfo } from '../actions/cartActions';
import { registerCliente } from '../actions/clienteActions';
import { CLIENTE_REGISTER_RESET } from '../constants/clienteConstants';
import NumberFormat from 'react-number-format';

export default function RegisterScreen(props) {
  const navigate = useNavigate();
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

      dispatch(
        saveClienteInfo({
          nic: rif,
          nombre,
          direccion,
          celular,
          telefono,
        })
      );

      dispatch(
        saveVendedorInfo({
          nombre: userInfo.nombre,
          apellido: userInfo.apellido,
          cedula: userInfo.cedula,
          email: userInfo.email,
          comision: 0,
          idVendedor: userInfo.idVendedor,
          isVendedor: userInfo.isVendedor,
        })
      );

      dispatch(
        saveShippingAddress({
          fullName: nombre,
          address: direccion,
          city: 'Caracas',
          postalCode: '1071 ',
          country: 'Venezuela',
        })
      );
      navigate('/payment');
    }
  }, [
    celular,
    clienteInfo,
    direccion,
    dispatch,
    navigate,
    nombre,
    rif,
    telefono,
    userInfo.apellido,
    userInfo.cedula,
    userInfo.email,
    userInfo.idVendedor,
    userInfo.isVendedor,
    userInfo.nombre,
  ]);

  useEffect(() => {
    if (error) {
      toast.success('Error: ' + error, {
        position: 'top-center',
        autoClose: 3000,
      });
      dispatch({ type: CLIENTE_REGISTER_RESET });
    }
  });

  return (
    <div>
      <form className="form registro clientes" onSubmit={submitHandler}>
        <div>
          <h1>Agregar Clientes</h1>
        </div>
        <div className="input__div">
          <input
            type="text"
            id="rif"
            value={rif}
            required
            onChange={e => setRif(e.target.value)}
            maxLength={10}
          ></input>
          <label htmlFor="rif">R.I.F. / Cedula</label>
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
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)}></input>
          <label htmlFor="email">Email</label>
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
