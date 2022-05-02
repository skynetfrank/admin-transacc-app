import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Tooltip from '../components/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function UserListScreen(props) {
  const navigate = useNavigate();
  const { pageNumber = 1 } = useParams();
  const [group, setGroup] = useState([...Array(5).keys()]);
  const [vendedor, setVendedor] = useState('');

  const userList = useSelector(state => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userDelete = useSelector(state => state.userDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = userDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers({ pageNumber: pageNumber, vendedor }));
    dispatch({
      type: USER_DETAILS_RESET,
    });
  }, [dispatch, pageNumber, successDelete, vendedor]);
  const deleteHandler = user => {
    if (window.confirm('Esta Seguro de Eliminar este Usuario?')) {
      dispatch(deleteUser(user._id));
    }
  };

  const previousPages = () => {
    const actualRange = Math.min(...group) - 1;
    if (actualRange <= 0) {
      return;
    }
    const previousRange = range(actualRange - 4, actualRange, 1);
    setGroup(previousRange);
  };

  const nextPages = () => {
    const previousRange = Math.max(...group) + 1;
    if (previousRange >= pages) {
      return;
    }

    const nextRange = range(previousRange, previousRange + 4, 1);
    setGroup(nextRange);
  };

  const firstPage = () => {
    const firstRange = range(0, 4, 1);
    setGroup(firstRange);
    // navigate('/pageNumber/1');
  };

  const lastPage = () => {
    const residuo = pages % 5;
    const lastRange = range(pages - residuo, pages + residuo, 1);
    setGroup(lastRange);
    // navigate(`/pageNumber/${pages}`);
  };

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  const vendedorHandler = e => {
    if (e.target.checked) {
      setVendedor('vendedor');
    } else {
      setVendedor('');
    }
  };

  return (
    <div>
      <h1 className="margenes">Usuarios Registrados</h1>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && <MessageBox variant="success">User Deleted Successfully</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <React.Fragment key={99}>
          <table className="table table-container__table table-container__table--break-sm">
            <thead>
              <tr>
                <th>Cedula</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>
                  <div>
                    <label htmlFor="vendedor">Es Vendedor? </label>
                    <input id="vendedor" type="checkbox" checked={vendedor} onChange={e => vendedorHandler(e)}></input>
                  </div>
                </th>
                <th>es Adminstrador?</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td data-heading="Cedula">{user.cedula}</td>
                  <td data-heading="Nombre">{user.nombre}</td>
                  <td data-heading="Apellido">{user.apellido}</td>
                  <td data-heading="Telefono">{user.telefono}</td>
                  <td data-heading="Email">{user.email}</td>
                  <td data-heading="Es Vendedor?">{user.isVendedor ? 'SI' : 'NO'}</td>
                  <td data-heading="Es Administrador">{user.isAdmin ? 'SI' : 'NO'}</td>
                  <td>
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() => navigate(`/user/${user._id}/edit`)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button type="button" className="small btn-circle" onClick={() => deleteHandler(user)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            <button onClick={firstPage}>#1</button>
            <button onClick={previousPages}>&#10096;</button>

            {group.map(x => (
              <Link
                className={x + 1 === page ? 'active' : x + 1 > pages ? 'outta-range' : ''}
                key={x + 1}
                to={`/userlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
            <button onClick={nextPages}>&#10097;</button>
            <Tooltip position="top" content="Ultimo">
              <button onClick={lastPage}>{pages}</button>
            </Tooltip>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
