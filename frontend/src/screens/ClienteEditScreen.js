import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { detailsCliente, updateClienteProfile } from '../actions/clienteActions';
import LoadingBox from '../components/LoadingBox';
import { CLIENTE_UPDATE_PROFILE_RESET } from '../constants/clienteConstants';

export default function ProfileScreen(props) {
  const navigate = useNavigate('');
  const conditions = ['Contado', 'Credito'];
  const params = useParams();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rif, setRif] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [telefono, setTelefono] = useState('');
  const [condiciones, setCondiciones] = useState('');
  const [prontopago, setProntopago] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [contacto, setContacto] = useState('');
  const [isTaller, setIsTaller] = useState(false);
  const { id: clienteId } = params;

  const clienteDetails = useSelector(state => state.clienteDetails);
  const { loading, cliente } = clienteDetails;
  const clienteUpdateProfile = useSelector(state => state.clienteUpdateProfile);
  const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = clienteUpdateProfile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cliente) {
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
      dispatch(detailsCliente(clienteId));
    } else {
      setNombre(cliente.nombre);
      setEmail(cliente.email);
      setRif(cliente.rif);
      setDireccion(cliente.direccion);
      setCelular(cliente.celular);
      setTelefono(cliente.telefono);
      setIsTaller(cliente.isTaller);
      setCondiciones(cliente.condiciones);
      setProntopago(cliente.prontopago);
      setDescuento(cliente.descuento);
      setContacto(cliente.contacto);
    }
  }, [dispatch, cliente, clienteId]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      updateClienteProfile({
        _id: clienteId,
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
        contacto,
      })
    );
  };
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
      toast.success('Cliente Actualizado', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate('/clientelist'),
      });
    }
  });

  useEffect(() => {
    if (errorUpdate) {
      toast.success('Error: Verifique el RIF y el EMAIL (podrian estar duplicados)', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
    }
  });

  return (
    <div>
      <Link to="/clientelist" className="back-link">
        volver a Clientes
      </Link>
      <form className="form profile" onSubmit={submitHandler}>
        <div>
          <h1>Editar Cliente</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            <div className="input__div">
              <input
                type="text"
                id="name"
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
                id="rif"
                pattern="[V|J|G][0-9]{9}"
                value={rif}
                required
                maxLength={10}
                onChange={e => setRif(e.target.value)}
              ></input>
              <label htmlFor="rif">R.I.F.</label>
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
                <label className="small-label">Condiciones</label>
                <select className="inline-select" value={condiciones} onChange={e => setCondiciones(e.target.value)}>
                  {conditions.map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small-label">% Pronto Pago</label>
                <select className="inline-select" value={prontopago} onChange={e => setProntopago(e.target.value)}>
                  {[...Array(12).keys()].map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small-label">% Descuento</label>
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
              <button className="primary" type="submit">
                Actualizar Cliente
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
