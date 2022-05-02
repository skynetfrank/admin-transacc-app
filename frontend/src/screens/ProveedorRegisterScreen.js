import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerProveedor } from '../actions/proveedorActions';
import { PROVEEDOR_REGISTER_RESET } from '../constants/proveedorConstants';

export default function RegisterScreen(props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rif, setRif] = useState('');
  const [celular, setCelular] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [condiciones, setCondiciones] = useState('');
  const [diascredito, setDiascredito] = useState(0);
  const [prontopago, setProntopago] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [contacto, setContacto] = useState('');

  const proveedorRegister = useSelector(state => state.proveedorRegister);
  const { userInfo, error } = proveedorRegister;
  const conditions = ['Contado', 'Credito'];
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      registerProveedor(
        nombre,
        email,
        rif,
        celular,
        telefono,
        direccion,
        condiciones,
        diascredito,
        prontopago,
        descuento,
        contacto
      )
    );
  };
  useEffect(() => {
    if (userInfo) {
      toast.success('Proveedor Registrado O.K.!', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: PROVEEDOR_REGISTER_RESET });
      setNombre('');
      setEmail('');
      setRif('');
      setDireccion('');
      setCelular('');
      setTelefono('');
      setCondiciones('');
      setDiascredito('');
      setProntopago('');
      setDescuento('');
      setContacto('-');
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (error) {
      toast.success('Error: Verifique el RIF y el EMAIL (podrian estar duplicados)', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: PROVEEDOR_REGISTER_RESET });
    }
  });

  return (
    <div>
      <Link to="/proveedorlist" className="back-link">
        volver Proveedores
      </Link>
      <form className="form registro" onSubmit={submitHandler}>
        <div>
          <h1>Agregar Proveedor</h1>
        </div>
        <div className="input__div">
          <input
            type="text"
            id="name"
            value={nombre}
            maxLength={50}
            required
            onChange={e => setNombre(e.target.value)}
          ></input>
          <label htmlFor="name">Nombre o Razon Social</label>
        </div>
        <div className="input__div">
          <input
            type="text"
            id="rif"
            pattern="[V|J|G][0-9]{9}"
            value={rif}
            maxLength={10}
            required
            onChange={e => setRif(e.target.value)}
          ></input>
          <label htmlFor="rif">R.I.F.</label>
        </div>

        <div className="input__div">
          <input
            type="text"
            id="direccion"
            value={direccion}
            maxLength={60}
            required
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
        <div className="inline-inputs">
          <div>
            <label className="small-label">Condiciones</label>
            <select className="inline-select prov" value={condiciones} onChange={e => setCondiciones(e.target.value)}>
              {conditions.map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="small-label">Dias Credito</label>
            <select className="inline-select prov" value={diascredito} onChange={e => setDiascredito(e.target.value)}>
              {[...Array(31).keys()].map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="small-label">% Pronto Pago</label>
            <select className="inline-select prov" value={prontopago} onChange={e => setProntopago(e.target.value)}>
              {[...Array(21).keys()].map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="small-label">% Descuento</label>
            <select className="inline-select prov" value={descuento} onChange={e => setDescuento(e.target.value)}>
              {[...Array(21).keys()].map(x => (
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
            Registrar Proveedor
          </button>
        </div>
      </form>
    </div>
  );
}
