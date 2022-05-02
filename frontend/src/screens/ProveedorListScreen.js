import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteProveedor, listProveedores } from '../actions/proveedorActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PROVEEDOR_DETAILS_RESET } from '../constants/proveedorConstants';

export default function UserListScreen(props) {
  const navigate = useNavigate();
  const proveedorList = useSelector(state => state.proveedorList);
  const { loading, error, proveedores } = proveedorList;

  const proveedorDelete = useSelector(state => state.proveedorDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = proveedorDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProveedores());
    dispatch({
      type: PROVEEDOR_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);

  const deleteHandler = proveedor => {
    if (window.confirm('Esta seguro de eliminar definitivamente esta empresa?')) {
      dispatch(deleteProveedor(proveedor._id));
    }
  };

  return (
    <div>
      <div className="row left">
        <h1 className="margenes">Proveedores</h1>
        <Link to="/registrarproveedor">
          <button type="button" className="margenes color">
            Agregar Proveedor
          </button>
        </Link>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table table-container__table table-container__table--break-sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>R.I.F.</th>
              <th>Direccion Fiscal</th>
              <th>Celular</th>
              <th>Telefono</th>
              <th>Condiciones</th>
              <th>Dias Credito</th>
              <th>Descu- ento</th>
              <th>Pronto Pago</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(proveedor => (
              <tr key={proveedor._id}>
                <td className="hide">{proveedor._id.substr(1, 6)}</td>
                <td data-heading="Razon Social" title={proveedor.nombre}>
                  {proveedor.nombre}
                </td>
                <td data-heading="R.I.F.">{proveedor.rif}</td>
                <td data-heading="Direccion Fiscal" title={proveedor.direccion}>
                  {proveedor.direccion.substr(0, 8)}
                </td>
                <td data-heading="Celular">{proveedor.celular}</td>
                <td data-heading="Telefono">{proveedor.telefono}</td>
                <td data-heading="Condiciones">{proveedor.condiciones}</td>
                <td data-heading="Dias Credito">{proveedor.diasCredito}</td>
                <td data-heading="Descuento">{proveedor.descuento}</td>
                <td data-heading="Pronto Pago">{proveedor.prontopago}</td>
                <td data-heading="Contacto" title={proveedor.contacto}>
                  {proveedor.contacto}
                </td>
                <td>
                  <button
                    type="button"
                    className="small btn-circle"
                    onClick={() => navigate(`/proveedor/${proveedor._id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button type="button" className="small btn-circle" onClick={() => deleteHandler(proveedor)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
