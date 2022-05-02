import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCliente, listClientes } from '../actions/clienteActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { CLIENTE_DETAILS_RESET } from '../constants/clienteConstants';

export default function UserListScreen(props) {
  const navigate = useNavigate();
  const clienteList = useSelector(state => state.clienteList);
  const { loading, error, clientes } = clienteList;

  const clienteDelete = useSelector(state => state.clienteDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = clienteDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listClientes());
    dispatch({
      type: CLIENTE_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);

  const deleteHandler = cliente => {
    if (window.confirm('Esta seguro de eliminar este cliente?')) {
      dispatch(deleteCliente(cliente._id));
    }
  };

  return (
    <div>
      <div className="row left">
        <h1 className="margenes">Clientes</h1>
        <Link to="/registrarcliente">
          <button type="button" className="margenes color">
            Agregar Empresa
          </button>
        </Link>
        {<MessageBox variant="borrar"></MessageBox>}
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
              <th className="hide">ID</th>
              <th>Nombre</th>
              <th>R.I.F.</th>
              <th>Direccion Fiscal</th>
              <th>Celular</th>
              <th>Telf</th>
              <th>Es Taller?</th>
              <th>cond.</th>
              <th>Desc.</th>
              <th>Pronto Pago</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente._id}>
                <td className="hide">{cliente._id.substr(1, 6)}</td>
                <td data-heading="Razon Social" title={cliente.nombre}>
                  {cliente.nombre}
                </td>
                <td data-heading="R.I.F.">{cliente.rif}</td>
                <td data-heading="Direccion Fiscal" title={cliente.direccion}>
                  {cliente.direccion.substr(0, 8)}
                </td>
                <td data-heading="Celular">{cliente.celular}</td>
                <td data-heading="Telefono">{cliente.telefono}</td>
                <td data-heading="Es un Taller?">{cliente.isTaller ? 'SI' : 'NO'}</td>
                <td data-heading="Condiciones">{cliente.condiciones}</td>
                <td data-heading="Descuento">{cliente.descuento}</td>
                <td data-heading="Pronto Pago">{cliente.prontopago}</td>
                <td data-heading="Contacto" title={cliente.contacto}>
                  {cliente.contacto}
                </td>
                <td data-heading="Acciones" className="td-menu">
                  <button
                    type="button"
                    className="small btn-circle"
                    onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button type="button" className="small btn-circle" onClick={() => deleteHandler(cliente)}>
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
