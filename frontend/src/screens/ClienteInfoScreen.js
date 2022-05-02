import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveClienteInfo, saveShippingAddress, saveVendedorInfo } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getClienteByRif } from '../actions/clienteActions';

export default function ShippingAddressScreen(props) {
  const inputRifRef = useRef();

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [telefono, setTelefono] = useState('');
  const [condiciones, setCondiciones] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [prontopago, setProntopago] = useState(0);
  const [esTaller, setEsTaller] = useState(false);
  const [rif, setRif] = useState('');
  const [nic, setNic] = useState('');

  const [nombrevendedor, setNombrevendedor] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [comision, setComision] = useState(0);
  const [idVendedor, setIdVendedor] = useState('');
  const [isVendedor, setIsVendedor] = useState(false);

  const navigate = useNavigate();
  /* 
  const { search } = useLocation();
  const rifInUrl = new URLSearchParams(search).get('rifback');
 */
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const consultaCliente = useSelector(state => state.clienteByRif);
  const { cliente } = consultaCliente;

  if (!userInfo) {
    navigate('/signin');
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClienteByRif(rif));
  }, [dispatch, rif]);

  useEffect(() => {
    if (cliente) {
      setNic(cliente.rif);
      setNombre(cliente.nombre);
      setDireccion(cliente.direccion);
      setTelefono(cliente.telefono);
      setCelular(cliente.celular);
      setCondiciones(cliente.condiciones);
      setDescuento(cliente.descuento);
      setProntopago(cliente.prontopago);
      setEsTaller(cliente.esTaller);
    }
    if (userInfo) {
      setNombrevendedor(userInfo.nombre);
      setApellido(userInfo.apellido);
      setCedula(userInfo.cedula);
      setEmail(userInfo.email);
      setComision(0);
      setIdVendedor(userInfo._id);
      setIsVendedor(userInfo.isVendedor);
    }
  }, [cliente, rif, userInfo]);

  const submitHandler = e => {
    if (!rif) {
      return;
    }

    e.preventDefault();
    if (!cliente) {
      navigate(`/clientefastregister?rif=${rif}`);
    }

    if (cliente) {
      dispatch(
        saveClienteInfo({
          nic,
          nombre,
          direccion,
          celular,
          telefono,
          condiciones: 'De Contado',
        })
      );

      dispatch(
        saveVendedorInfo({
          nombre: nombrevendedor,
          apellido,
          cedula,
          email,
          comision,
          idVendedor,
          isVendedor,
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
      if (userInfo.isVendedor) {
        navigate('/payment');
      }
      if (userInfo.isAdmin) {
        navigate('/placecotizacion');
      }
    }
  };

  const clearCode = e => {
    e.preventDefault();
    inputRifRef.current.value = '';
    setRif('');
  };

  const verificarRif = e => {
    let valor = e.target.value;
    const rifx = valor.trim().toUpperCase();
    const letra = rifx.charAt(0);

    if (letra !== 'J' && letra !== 'V' && letra !== 'E' && letra !== 'G') {
      toast.error('Primera Letra debe ser V-J-E o G', {
        position: 'top-center',
        autoClose: 2500,
      });
      inputRifRef.current.value = '';
      return;
    }

    if (letra === 'V' || letra === 'E') {
      const cedulaRegex = /^[V|E][0-9]{6,9}$/;
      if (!validarInput(rifx, cedulaRegex)) {
        console.log('CEDULA INVALIDA');
        return;
      }
    }

    if (letra === 'J' || letra === 'G') {
      const cedulaRegex = /^[J|G][0-9]{9}$/;
      if (!validarInput(rifx, cedulaRegex)) {
        console.log('RIF INVALIDO');
        return;
      }
    }

    console.log('RIF VALIDO====>>>>>:', rifx);
    inputRifRef.current.value = rifx;

    setRif(rifx);
  };

  const registrarCliente = () => {
    navigate(`/clientefastregister?rif=${rif}`);
  };

  function validarInput(valor, exp) {
    return valor.match(exp) ? true : false;
  }

  console.log('CLIENTE-INFO-SCREEN userInfo', userInfo);
  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="form">
        <div>
          <h1>Informacion del Cliente</h1>
        </div>
        <div>
          <label htmlFor="rif">Cedula / R.I.F</label>

          <div className="busqueda-rif">
            <input
              id="busqueda-rif"
              ref={inputRifRef}
              maxLength={10}
              type="text"
              placeholder="ingresar sin guiones"
              required
              onChange={e => verificarRif(e)}
            ></input>
            <button className="btn-clear-codigo" onClick={clearCode}>
              &#9746;
            </button>
          </div>
          {!cliente && rif ? <span>cliente no registrado</span> : ''}
        </div>
        {cliente ? (
          <div className="ficha-cliente">
            <p>
              <strong>Nombre:</strong>
              <span className="ficha-cliente-nombre"> {cliente.nombre}</span>
            </p>
            <p>
              <strong>Telefonos:</strong>:{cliente.celular} {cliente.telefono}
            </p>
            <p>
              <strong>Direccion:</strong> {cliente.direccion}
            </p>
            <p>
              <strong>Condiciones:</strong> {cliente.condiciones}
            </p>
            <p>
              <strong>Descuento:</strong> {cliente.descuento}%
            </p>
            <p>
              <strong>Pronto Pago:</strong> {cliente.prontopago}%
            </p>
            <p>
              <strong>Es un Taller?:</strong> {cliente.esTaller ? 'SI' : 'NO'}
            </p>
            <p>
              <strong>Contacto:</strong> {cliente.contacto}
            </p>
          </div>
        ) : (
          ''
        )}

        <div>
          <label />

          <button className="primary" type="button" onClick={submitHandler}>
            Continuar...
          </button>
        </div>
      </div>
    </div>
  );
}
