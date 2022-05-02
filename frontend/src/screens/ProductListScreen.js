import { faPencilAlt, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { deleteProduct, listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_DELETE_RESET } from '../constants/productConstants';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../components/Tooltip';

export default function ProductListScreen(props) {
  const navigate = useNavigate();
  const { pageNumber = 1 } = useParams();
  const [group, setGroup] = useState([...Array(5).keys()]);
  const [palabra, setPalabra] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [escodigo, setEscodigo] = useState('');

  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf('/seller') >= 0;

  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (busqueda === '') {
      dispatch(listProducts({ nombre: '', pageNumber: pageNumber }));
    } else {
      if (/\d/.test(escodigo)) {
        dispatch(listProducts({ nombre: '', codigo: busqueda, pageNumber: pageNumber }));
        return;
      }
      dispatch(listProducts({ nombre: busqueda, codigo: '', pageNumber: pageNumber }));
    }
  }, [busqueda, dispatch, escodigo, pageNumber]);

  const busquedaHandler = () => {
    const firstLetter = palabra.charAt(0);
    setEscodigo(firstLetter);
    setBusqueda(palabra);
  };

  const palabraHandler = e => {
    setPalabra(e.target.value);
  };

  const clearSearch = () => {
    setBusqueda('');
    setPalabra('');
    navigate('/productlist/pageNumber/1');
  };

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber }));
  }, [dispatch, navigate, sellerMode, successDelete, userInfo._id, pageNumber]);

  const deleteHandler = product => {
    if (window.confirm('Esta Seguro de Eliminar Este Producto?')) {
      dispatch(deleteProduct(product._id));
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

  const mostrarValor = valor => {
    const items = valor.map(v => v.value + ' ');
    return items;
  };

  return (
    <div>
      <div className="row">
        <h1 className="margenes">Productos</h1>
        <div className="search-div">
          <input
            type="text"
            value={palabra}
            className="search-input"
            placeholder="buscar..."
            onChange={palabraHandler}
          ></input>
          <FontAwesomeIcon icon={faSearch} onClick={busquedaHandler} />
          <Tooltip position="bottom" content="borrar texto">
            <button id="btn-clear" className="btn-clear" onClick={clearSearch}>
              &#10008;
            </button>
          </Tooltip>
        </div>

        <Link to="/createproduct">
          <button type="button" className="margenes color">
            Agregar Producto
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
        <React.Fragment key={99}>
          <table className="table table-container__table table-container__table--break-sm" id="product-list-table">
            <thead>
              <tr>
                <th className="hidden">ID-Producto</th>
                <th>Codigo</th>
                <th>Marca</th>
                <th>Nombre</th>
                <th>tags</th>
                <th>Costo $</th>
                <th>Precio $</th>
                <th>Stock</th>
                <th>Reposicion</th>

                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td className="hidden" data-heading="ID-PRODUCTO">
                    {product._id.substr(1, 10)}
                  </td>
                  <td data-heading="codigo">{product.codigo.substr(0, 12)}</td>
                  <td data-heading="Marca" title={product.marca}>
                    {product.marca}
                  </td>
                  <td data-heading="Nombre Producto" title={product.nombre}>
                    {product.nombre}
                  </td>
                  <td data-heading="Tags" title={mostrarValor(product.tags)}>
                    {mostrarValor(product.tags)}
                  </td>

                  <td data-heading="Costo $">{product.costousd}</td>
                  <td data-heading="Precion $">{product.preciousd}</td>

                  <td data-heading="Stock">{product.existencia}</td>
                  <td data-heading="Reposicion">{product.reposicion}</td>
                  <td data-heading="Acciones">
                    <button type="button" className="small btn-circle">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="search-product-icon"
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                    </button>
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() => navigate(`/product/${product._id}/edit`)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button type="button" className="small btn-circle" onClick={() => deleteHandler(product)}>
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
                to={`/productlist/pageNumber/${x + 1}`}
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
