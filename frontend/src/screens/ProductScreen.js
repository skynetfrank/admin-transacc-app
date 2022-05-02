import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate, useParams } from 'react-router-dom';
import { isGeneric } from '../utils/isgeneric';

function ProductScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: productId } = params;
  const [qty, setQty] = useState(1);
  //const [disponible, setDisponible] = useState(0);
  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(detailsProduct(productId));
  }, [dispatch, productId]);

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`);
  };

  const mostrarValor = valor => {
    if (!valor) {
      return;
    }
    const items = valor.map(v => v.value + ', ');
    return items;
  };

  console.log('PRODUCT-SCREEN:', product, 'code', isGeneric(product?.codigo));
  return (
    <div className="screen-offset">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">Ha ocurrido un error: {error}</MessageBox>
      ) : (
        <div className="screen-offset">
          <div className="row">
            <div className="col-2">
              <div className="img-container">
                <img className="large" src={product.imageurl} alt={product.nombre} />
              </div>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h2>{product.nombre}</h2>
                </li>
                <li>
                  <h2>Precio ${product.preciousd.toFixed(2)}</h2>
                </li>
                <li>
                  <h3>{product.descripcion}</h3>
                </li>
                <li>
                  <div>
                    <ul className="ul-prod-screen">
                      <label className="label-prod-screen">Ficha Tecnica:</label>
                      <li>
                        <p>Vehiculo:</p> <span className="ficha-tecnica"> {mostrarValor(product.vehiculo)}</span>
                      </li>
                      <li>
                        <p>Modelo: </p> <span className="ficha-tecnica"> {mostrarValor(product.modelos)}</span>
                      </li>
                      <li>
                        <p>Siglas:</p> <span className="ficha-tecnica"> {mostrarValor(product.tags)}</span>
                      </li>
                      <li>
                        <p>Año:</p> <span className="ficha-tecnica"> {mostrarValor(product.years)}</span>
                      </li>
                      <li>
                        <p>Motor:</p>
                        <span className="ficha-tecnica">{mostrarValor(product.motores)}</span>
                      </li>
                      <li>
                        <p>Numero de Parte ({product.marca}):</p>
                        <span className="ficha-tecnica">
                          {isGeneric(product.codigo)
                            ? product.codigo.substr(0, product.codigo.indexOf('-'))
                            : product.codigo}
                        </span>
                      </li>
                      <li>
                        <p>Ubicacion Almacen: ({product.ubicacion}):</p>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card resumen">
                <div className="row center">
                  <h1>Resumen</h1>
                </div>

                <ul>
                  <li>
                    <div className="row">
                      <div>Precio:</div>
                      <div className="price">${product.preciousd?.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Status:</div>
                      <div>
                        {product.existencia > 0 ? (
                          <span className="success">Disponible</span>
                        ) : (
                          <span className="danger">No Disponible</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.existencia > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Cantidad:</div>
                          <div>
                            <select id="select-cant" value={qty} onChange={e => setQty(e.target.value)}>
                              {[...Array(product.existencia).keys()].map(x => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </li>

                      <li>
                        <button
                          className="primary block"
                          onClick={addToCartHandler}
                          disabled={product.existencia === 0}
                        >
                          Agregar al Pedido
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
