import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../components/Tooltip';

function HomeScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;
  const [busqueda, setBusqueda] = useState('');
  const [palabra, setPalabra] = useState('');
  const [group, setGroup] = useState([...Array(5).keys()]);
  const { pageNumber = 1 } = useParams();
  const [escodigo, setEscodigo] = useState('');

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
    navigate('/pageNumber/1');
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
    navigate('/pageNumber/1');
  };

  const lastPage = () => {
    const residuo = pages % 5;
    const lastRange = range(pages - residuo, pages + residuo, 1);
    setGroup(lastRange);
    navigate(`/pageNumber/${pages}`);
  };

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">Conexion Interrumpida: {error}</MessageBox>
      ) : (
        <>
          <div className="search-div">
            <h1>Nuestros Productos</h1>
            <input
              type="text"
              value={palabra}
              className="search-input"
              placeholder="buscar por nombre o codigo"
              onChange={palabraHandler}
            ></input>
            <FontAwesomeIcon icon={faSearch} onClick={busquedaHandler} />
            <Tooltip position="bottom" content="borrar texto">
              <button id="btn-clear" className="btn-clear" onClick={clearSearch}>
                &#10008;
              </button>
            </Tooltip>
          </div>
          {products.length === 0 && <MessageBox>No hay Productos</MessageBox>}
          <div className="row center gapper">
            {products.map(product => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>

          {pages > 0 ? (
            <div className="row center pagination">
              <button onClick={firstPage}>#1</button>
              <button onClick={previousPages}>&#10096;</button>

              {group.map(x => (
                <Link
                  className={x + 1 === page ? 'active' : x + 1 > pages ? 'outta-range' : ''}
                  key={x + 1}
                  to={`/pageNumber/${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
              <button onClick={nextPages}>&#10097;</button>
              <Tooltip position="top" content="Ultimo">
                <button onClick={lastPage}>#N</button>
              </Tooltip>
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
}

export default HomeScreen;
