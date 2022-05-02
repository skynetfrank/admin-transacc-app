import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProveedor, updateProveedorProfile } from '../actions/proveedorActions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import { PROVEEDOR_UPDATE_PROFILE_RESET } from '../constants/proveedorConstants';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';

export default function ProfileScreen(props) {
  const navigate = useNavigate('');
  const conditions = ['Contado', 'Credito'];
  const params = useParams();
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
  const { id: proveedorId } = params;

  const proveedorDetails = useSelector(state => state.proveedorDetails);
  const { loading, proveedor } = proveedorDetails;
  const proveedorUpdateProfile = useSelector(state => state.proveedorUpdateProfile);
  const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = proveedorUpdateProfile;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!proveedor) {
      dispatch({ type: PROVEEDOR_UPDATE_PROFILE_RESET });
      dispatch(detailsProveedor(proveedorId));
    } else {
      setNombre(proveedor.nombre);
      setEmail(proveedor.email);
      setRif(proveedor.rif);
      setCelular(proveedor.celular);
      setTelefono(proveedor.telefono);
      setDireccion(proveedor.direccion);
      setCondiciones(proveedor.condiciones);
      setDiascredito(proveedor.diasCredito);
      setProntopago(proveedor.prontopago);
      setDescuento(proveedor.descuento);
      setContacto(proveedor.contacto);
    }
  }, [dispatch, proveedor, proveedorId]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      updateProveedorProfile({
        _id: proveedorId,
        nombre,
        email,
        rif,
        celular,
        telefono,
        direccion,
        condiciones,
        diasCredito: diascredito,
        prontopago,
        descuento,
        contacto,
      })
    );
  };
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PROVEEDOR_UPDATE_PROFILE_RESET });
      toast.success('Proveedor Actualizado', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate('/proveedorlist'),
      });
    }
  });

  useEffect(() => {
    if (errorUpdate) {
      toast.success('Error: Verifique el RIF y el EMAIL (podrian estar duplicados)', {
        position: 'top-center',
        autoClose: 2000,
      });
      dispatch({ type: PROVEEDOR_UPDATE_PROFILE_RESET });
    }
  });

  return (
    <div>
      <Link to="/proveedorlist" className="back-link">
        volver a Proveedores
      </Link>
      <form className="form profile" onSubmit={submitHandler}>
        <div>
          <h1>Editar Proveedor</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            <div className="input__div">
              <input
                type="text"
                value={nombre}
                id="name"
                maxLength={50}
                required
                onChange={e => setNombre(e.target.value)}
              ></input>
              <label htmlFor="name">Nombre o Razon Social</label>
            </div>
            <div className="input__div">
              <input
                type="text"
                value={rif}
                id="rif"
                maxLength={10}
                pattern="[V|J|G][0-9]{9}"
                required
                onChange={e => setRif(e.target.value)}
              ></input>
              <label htmlFor="rif">R.I.F.</label>
            </div>

            <div className="input__div">
              <input
                type="text"
                value={direccion}
                id="direccion"
                maxLength={80}
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
              <input type="email" value={email} id="email" required onChange={e => setEmail(e.target.value)}></input>
              <label htmlFor="email">Email</label>
            </div>

            <div className="inline-inputs">
              <div>
                <label className="small-label">Condiciones</label>
                <select
                  className="inline-select prov"
                  value={condiciones}
                  onChange={e => setCondiciones(e.target.value)}
                >
                  {conditions.map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small-label">Dias Credito</label>
                <select
                  className="inline-select prov"
                  value={diascredito}
                  onChange={e => setDiascredito(e.target.value)}
                >
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
                value={contacto}
                id="contacto"
                required
                onChange={e => setContacto(e.target.value)}
              ></input>
              <label htmlFor="contacto">Contacto</label>
            </div>
            <div>
              <label />
              <button className="primary" type="submit">
                Actualizar Proveedor
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
