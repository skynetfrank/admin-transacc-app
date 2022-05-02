import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductoByCode } from '../actions/productActions';
import { createEntrada } from '../actions/entradaActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { addToMov, removeFromMov } from '../actions/movActions';
import { PRODUCT_BYCODE_RESET } from '../constants/productConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ENTRADA_CREATE_RESET } from '../constants/entradaConstants';
import { format } from 'date-fns';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { MOV_EMPTY } from '../constants/movConstants';

function NotaEntradaScreen(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState('');
  const [fechaMovimiento, setFechaMovimiento] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada');
  const [tipoDoc, setTipoDoc] = useState('Nota de Almacen');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [montoTotalUSD, setMontoTotalUSD] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [montoTotalBs, setMontoTotalBs] = useState(0);
  const [proveedor, setProveedor] = useState('');
  const [costobs, setCostobs] = useState(1);
  const [idProducto, setIdProducto] = useState('');
  const [costousd, setCostousd] = useState(1);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const productbyCode = useSelector(state => state.productbyCode);
  const { loading, error, producto } = productbyCode;

  const entradaCreate = useSelector(state => state.entradaCreate);
  const { loading: entradaLoading, success, error: entradaError, entrada } = entradaCreate;

  const mov = useSelector(state => state.mov);
  const { movItems, error: errorMov } = mov;

  const toPrice = num => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  mov.itemsPrice = toPrice(mov.movItems.reduce((a, c) => a + c.qty * c.costousd, 0));
  mov.shippingPrice = mov.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  mov.taxPrice = toPrice(0.16 * mov.itemsPrice);
  mov.totalPrice = mov.itemsPrice + mov.shippingPrice + mov.taxPrice;
  mov.montoTotalBs = toPrice(mov.movItems.reduce((a, c) => a + c.qty * c.costobs, 0));
  mov.montoTotalUSD = toPrice(mov.movItems.reduce((a, c) => a + c.costousd, 0));

  useEffect(() => {
    let isCancelled = false;
    const fetchCambio = async () => {
      try {
        const { data } = await Axios.get('https://s3.amazonaws.com/dolartoday/data.json');
        setCambio(data.USD.sicad2);
      } catch (error) {
        toast.error('Api Dolar Today No Disponible');
      }
    };
    fetchCambio();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const allProducts = async () => {
      try {
        const { data } = await Axios.get('/api/productos', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        console.log('data productos', data);
        let dataProductos = data.productos.map(x => x.codigo);
        dataProductos.unshift(' ');
        setProductos(dataProductos);
      } catch (error) {
        console.log('Error al cargar productos', error);
      }
    };

    allProducts();
  }, []);

  useEffect(() => {
    const prov = async () => {
      try {
        const { data } = await Axios.get('/api/proveedores', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        let nombres = data.map(x => x.nombre);
        nombres.unshift(' ');
        setProveedores(nombres);
      } catch (error) {
        console.log('Error al cargar proveedores', error);
      }
    };

    prov();
  }, []);

  const tiposDoc = ['Factura', 'Orden de Compra', 'Nota de Entrega', 'Nota de Almacen'];
  const tiposMov = ['entrada', 'ajuste'];

  useEffect(() => {
    if (error) {
      dispatch({ type: PRODUCT_BYCODE_RESET });
    }
  });

  useEffect(() => {
    dispatch(getProductoByCode(code));
  }, [code, dispatch]);

  useEffect(() => {
    if (producto) {
      setIdProducto(producto.productId);
      setQty(qty);
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
    }
  }, [producto, qty]);

  const removeFromMovHandler = id => {
    dispatch(removeFromMov(id));
  };

  const addToMovHandler = () => {
    if (!code) {
      toast.info('Falta Codigo de Producto!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }

    if (costousd <= 0) {
      toast.error('Debe ingresar un costo mayor a 0', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }
    if (qty <= 0) {
      toast.error('Debe ingresar una cantidad mayor a 0', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }

    dispatch(addToMov(idProducto, Number(qty), Number(costousd), cambio));
    setCode('');
    setQty(1);
    setCostousd(1);
    setCostobs(1);
    setNombre('');
    setDescripcion('');
  };

  const guardarEntradaHandler = () => {
    if (!fechaMovimiento) {
      toast.info('Falta La Fecha!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }
    if (!numeroDocumento) {
      toast.info('Falta Numero de Documento!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }
    if (!cambio) {
      toast.info('Falta El cambio del dia!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }

    if (!proveedor) {
      toast.info('Falta El Proveedor!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }
    mov.notaNumero = numeroDocumento;
    mov.fechaMovimiento = fechaMovimiento;
    mov.tipoMovimiento = tipoMovimiento;
    mov.tipoDoc = tipoDoc;
    mov.numeroDocumento = numeroDocumento;
    mov.cambio = cambio;
    mov.proveedor = proveedor;

    dispatch(createEntrada({ ...mov, entradaItems: mov.movItems }));
  };

  useEffect(() => {
    if (success) {
      navigate(`/entrada/${entrada._id}`);
      dispatch({ type: ENTRADA_CREATE_RESET });
      dispatch({ type: MOV_EMPTY });
      localStorage.removeItem('movItems');
    }
  }, [dispatch, entrada, navigate, success]);

  console.log('NOTA ENTRADA SCREE:', 'MOV:', mov, 'ENTRADA:', entrada);

  return (
    <div className="screen-offset">
      {loading ? (
        ''
      ) : (
        <>
          <div className="row-container-entradas">
            <div className="semi-logo">
              <label>NOTA DE ENTRADA</label>
            </div>
            <div>
              <label htmlFor="name" className="small-label">
                Fecha
              </label>
              <input
                id="fecha-entrada"
                type="date"
                value={fechaMovimiento}
                required
                onChange={e => setFechaMovimiento(e.target.value)}
              ></input>
            </div>
            <div>
              <label className="small-label">Movimiento</label>
              <select
                className="inline-select producto"
                id="select-movimiento-entrada"
                value={tipoMovimiento}
                placeholder="selecionar"
                onChange={e => setTipoMovimiento(e.target.value)}
              >
                {tiposMov.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="small-label">Tipo-Documento</label>
              <select
                className="inline-select producto"
                id="select-tipodoc-entrada"
                value={tipoDoc}
                placeholder="selecionar"
                onChange={e => setTipoDoc(e.target.value)}
              >
                {tiposDoc.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="doc-entrada" className="small-label">
                Documento No.
              </label>
              <input
                id="doc-entrada"
                type="text"
                value={numeroDocumento}
                className="w60"
                maxLength="15"
                required
                onChange={e => setNumeroDocumento(e.target.value)}
              ></input>
            </div>

            <div>
              <label htmlFor="ndoc" className="small-label">
                Cambio
              </label>
              <input
                id="cambio-entrada"
                type="number"
                className="w60"
                value={cambio}
                onChange={e => setCambio(e.target.value)}
              ></input>
            </div>
            <div>
              <label className="small-label">Proveedor</label>
              <select
                className="inline-select producto"
                id="select-proveedor-entrada"
                value={proveedor}
                required
                onChange={e => setProveedor(e.target.value)}
              >
                {proveedores?.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      {numeroDocumento && (
        <div className="row-container-entradas">
          <div id="div-select-codigo-entrada">
            <label className="small-label">Codigo</label>
            <select
              className="inline-select producto"
              id="select-codigo-entrada"
              value={code}
              placeholder="selecionar"
              onChange={e => setCode(e.target.value)}
            >
              {productos.map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="existencia" className="small-label">
              Cantidad:{' '}
            </label>
            <input
              id="cantidad-entrada"
              type="number"
              value={qty}
              required
              onChange={e => setQty(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="precio" className="small-label">
              Costo US$:
            </label>
            <input
              id="costo-entrada"
              type="number"
              className="w60"
              value={costousd}
              onChange={e => setCostousd(e.target.value)}
            ></input>
          </div>

          {producto && (
            <span className="div-show-product-entrada">
              <p className="mini-fontsize">Producto</p>
              <span className="show-product-entrada">{nombre}</span>
              <span className="show-product-entrada">{descripcion}</span>
            </span>
          )}
          <div>
            <button className="primary block noMargin" id="btn-agregar-prod-entrada" onClick={addToMovHandler}>
              Agregar Producto
            </button>
          </div>
        </div>
      )}
      {movItems.length > 0 && (
        <div className="row top">
          <div className="col-2 mov">
            <ul className="carrito-ul">
              {movItems.map((item, index) => (
                <li key={item.producto + index}>
                  <div className="row shadow">
                    <div>
                      <img src={item.imageurl} alt="foto" className="small entrada"></img>
                    </div>

                    <div className="min-30 nombre-producto entrada">
                      <Link to={`/product/${item.producto}`}>{item.nombre}</Link>
                    </div>

                    <div className="costo-entrada">{item.qty} unidad (es)</div>

                    <div className="costo-entrada">costo US$: {item.costousd.toFixed(2)}</div>
                    <div className="costo-entrada">costo Bs.: {item.costobs.toFixed(2)}</div>

                    <div>
                      <FontAwesomeIcon icon={faTrashAlt} onClick={() => removeFromMovHandler(item.producto)} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-1 entrada">
            <div className="card resumen entrada">
              <div className="row center">
                <h1>Resumen</h1>
              </div>
              <ul>
                <li className="row">
                  <h2 className="mov-subtotal">({movItems.reduce((a, c) => a + c.qty, 0)} Articulos):</h2>
                </li>
                <li className="row">
                  <h2 className="mov-subtotal">Total US$:</h2>
                  <h2 className="mov-subtotal">${movItems.reduce((a, c) => a + c.costousd * c.qty, 0).toFixed(2)}</h2>
                </li>
                <li className="row">
                  <h2 className="mov-subtotal">Total Bs.:</h2>
                  <h2 className="mov-subtotal">
                    Bs.
                    {movItems.reduce((a, c) => a + c.costobs * c.qty, 0).toFixed(2)}
                  </h2>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={guardarEntradaHandler}
                    className="primary block"
                    disabled={movItems.length === 0}
                  >
                    Guardar Nota de Entrada
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotaEntradaScreen;
