import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, listProducts, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
  presentaciones,
  marcas,
  opciones,
  selectModelos,
  selectMotores,
  selectVehiculos,
  selectYears,
} from '../constants/selectsData';
import { PROVEEDOR_LIST_RESET } from '../constants/proveedorConstants';
import { listProveedores } from '../actions/proveedorActions';

export default function ProductEditScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id: productId } = params;
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [marca, setMarca] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [unidades, setUnidades] = useState(0);
  const [vehiculo, setVehiculo] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [years, setYears] = useState([]);
  const [motores, setMotores] = useState([]);
  const [tags, setTags] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [existencia, setExistencia] = useState(0);
  const [reposicion, setReposicion] = useState(0);
  const [costobs, setCostobs] = useState(0);
  const [costousd, setCostousd] = useState(0);
  const [preciobs, setPreciobs] = useState(0);
  const [preciousd, setPreciousd] = useState(0);
  const [proveedor, setProveedor] = useState('');
  const [imageurl, setImageurl] = useState('');
  const [cambio, setCambio] = useState();

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
      width: 300,
    }),
  };

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  const proveedorList = useSelector(state => state.proveedorList);
  const { proveedores } = proveedorList;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProveedores());
  }, []);

  useEffect(() => {
    const fetchCambio = async () => {
      try {
        const { data } = await Axios.get('https://s3.amazonaws.com/dolartoday/data.json');
        setCambio(data.USD.sicad2);
      } catch (error) {
        toast.error('Api Dolar Today No Disponible');
      }
    };
    fetchCambio();
  }, []);

  useEffect(() => {
    if (successUpdate) {
      toast.success('Informacion Actualizada ok', {
        position: 'top-center',
        autoClose: 1500,
      });
      navigate('/productlist');
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setCodigo(product.codigo || ' ');
      setNombre(product.nombre || ' ');
      setUbicacion(product.ubicacion || ' ');
      setMarca(product.marca || ' ');
      setPresentacion(product.presentacion || ' ');
      setUnidades(product.unidades || ' ');
      setVehiculo(product.vehiculo || []);
      setModelos(product.modelos || []);
      setYears(product.years || []);
      setMotores(product.motores || []);
      setTags(product.tags || ' ');
      setCategoria(product.categoria || ' ');
      setDescripcion(product.descripcion || ' ');
      setExistencia(product.existencia || 0);
      setReposicion(product.reposicion || 0);
      setCostobs(product.costobs || 0);
      setCostousd(product.costousd || 0);
      setPreciobs(product.preciobs || 0);
      setPreciousd(product.preciousd || 0);
      setProveedor(product.proveedor || ' ');
      setImageurl(product.imageurl || ' ');
    }
  }, [product, dispatch, productId, successUpdate, navigate]);

  const submitHandler = e => {
    e.preventDefault();

    dispatch(
      updateProduct({
        _id: productId,
        codigo,
        nombre,
        ubicacion,
        marca,
        presentacion,
        unidades,
        vehiculo,
        modelos,
        years,
        motores,
        tags,
        categoria,
        descripcion,
        existencia,
        reposicion,
        costobs,
        costousd,
        preciobs,
        preciousd,
        proveedor,
        imageurl,
      })
    );
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const uploadFileHandler = async e => {
    const image = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append('file', image);
    bodyFormData.append('upload_preset', 'lacimapreset');
    bodyFormData.append('cloud_name', 'lacimaimg');
    bodyFormData.append('folder', 'productos');
    setLoadingUpload(true);

    try {
      const { data } = await Axios.post('https://api.cloudinary.com/v1_1/lacimaimg/image/upload', bodyFormData);
      setImageurl(data.url);
      setLoadingUpload(false);
    } catch (error) {
      setImageurl('images/jeep1.jpg');
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const getCosto = async e => {
    try {
      setCostobs((parseFloat(e) * parseFloat(cambio)).toFixed(2));
      setCostousd(e);
    } catch (error) {
      toast.error('Api Dolar Today No Disponible');
    }
  };

  const getPrecio = async e => {
    try {
      setPreciobs((parseFloat(e) * parseFloat(cambio)).toFixed(2));
      setPreciousd(e);
    } catch (error) {
      toast.error('Api Dolar Today No Disponible');
    }
  };

  const tagsChanges = valor => {
    setTags(valor);
  };

  const yearsChanges = valor => {
    setYears(valor);
  };
  const vehiculoChanges = valor => {
    setVehiculo(valor);
  };
  const motoresChanges = valor => {
    setMotores(valor);
  };
  const modelosChanges = valor => {
    setModelos(valor);
  };
  const selectCategorias = [
    ' ',
    'Accesorios',
    'Aire Acondicionado y Calefacción',
    'Carrocería',
    'Gasolina',
    'Correa de Transmisión',
    'Dirección',
    'Eléctrico',
    'Encendido',
    'Freno y Rueda',
    'Limpiaparabrisas',
    'Lubricantes',
    'Motor',
    'Sistema de Enfriamiento',
    'Suspensión',
    'Transmisión-Automática',
    'Transmisión-Manual',
  ];

  useEffect(() => {
    if (error) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
    }
  });

  return (
    <div className="wrapper">
      <div className="titulo">
        <h1>Editar Producto</h1>
        <Link to="/productlist" className="back-link producto">
          volver a Productos
        </Link>
      </div>
      <form className="form producto" id="form-producto" onSubmit={submitHandler}>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && console.log('errorUpdate')}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          toast.error('Ocurrio un error')
        ) : (
          <React.Fragment key={99}>
            <div className="row-container">
              <div>
                <label htmlFor="codigo">Codigo</label>
                <input id="codigo" type="text" value={codigo} disabled></input>
              </div>

              <div>
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={nombre}
                  maxLength="50"
                  required
                  onChange={e => setNombre(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="descripcion">Descripcion</label>
                <textarea
                  id="descripcion"
                  rows="1"
                  type="text"
                  maxLength="100"
                  required
                  placeholder="breve descripcion del producto"
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="small-label">Marca</label>
                <select
                  className="inline-select producto"
                  value={marca}
                  placeholder="selecionar"
                  onChange={e => setMarca(e.target.value)}
                >
                  {marcas.map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small-label">Presentacion</label>
                <select
                  className="inline-select producto"
                  value={presentacion}
                  onChange={e => setPresentacion(e.target.value)}
                >
                  {presentaciones.map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small-label">Unidades</label>
                <select
                  className="inline-select producto"
                  id="select-unidades"
                  value={unidades}
                  onChange={e => setUnidades(e.target.value)}
                >
                  {[...Array(601).keys()].map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row-container">
              <div>
                <label htmlFor="costousd">Costo US$</label>
                <input
                  id="costousd"
                  type="number"
                  value={costousd}
                  required
                  onChange={e => getCosto(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="costobs">Costo Bs.</label>
                <input
                  id="costobs"
                  type="number"
                  value={costobs}
                  required
                  onChange={e => setCostobs(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="preciousd">Precio US$</label>
                <input
                  id="preciousd"
                  type="number"
                  placeholder="Precio de Venta en US$"
                  value={preciousd}
                  required
                  onChange={e => getPrecio(e.target.value)}
                ></input>
              </div>

              <div>
                <label htmlFor="preciobs">Precio Bs.</label>
                <input
                  id="preciobs"
                  type="number"
                  placeholder="Precio de Venta en Bs."
                  value={preciobs}
                  required
                  onChange={e => setPreciobs(e.target.value)}
                ></input>
              </div>

              <div>
                <label htmlFor="existencia">Existencia</label>
                <input
                  id="existencia"
                  type="number"
                  placeholder="numero de unidades en Stock"
                  value={existencia}
                  required
                  onChange={e => setExistencia(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="reposicion">Reposicion</label>
                <input
                  id="reposicion"
                  type="number"
                  placeholder="minimo en stock para reponer"
                  value={reposicion}
                  onChange={e => setReposicion(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="cambio">cambio$</label>
                <input
                  id="cambio"
                  type="number"
                  placeholder="cambio"
                  value={cambio}
                  onChange={e => setCambio(e.target.value)}
                ></input>
              </div>
              <div>
                <label className="small-label">Categoria</label>
                <select
                  className="inline-select producto categoria"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                >
                  {selectCategorias.map(x => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row-container selectores">
              <div className="multiselect">
                <label className="legacy">MARCA</label>
                <Select
                  id="select3"
                  options={selectVehiculos}
                  value={vehiculo}
                  styles={customStyles}
                  isMulti
                  noOptionsMessage={() => 'No existe esa opcion en la lista'}
                  isSearchable
                  placeholder="selecionar"
                  onChange={vehiculoChanges}
                />
              </div>
              <div className="multiselect">
                <label className="legacy">MODELO</label>
                <Select
                  id="select5"
                  options={selectModelos}
                  value={modelos}
                  styles={customStyles}
                  noOptionsMessage={() => 'No existe esa opcion en la lista'}
                  isMulti
                  isSearchable
                  placeholder="selecionar"
                  onChange={modelosChanges}
                />
              </div>
              <div className="multiselect">
                <label className="legacy">MOTOR</label>
                <Select
                  id="select4"
                  options={selectMotores}
                  value={motores}
                  styles={customStyles}
                  isMulti
                  placeholder="selecionar"
                  onChange={motoresChanges}
                />
              </div>
            </div>
            <div className="row-container selectores">
              <div className="multiselect">
                <label className="legacy">AÑO</label>
                <Select
                  id="select2"
                  options={selectYears}
                  value={years}
                  styles={customStyles}
                  noOptionsMessage={() => 'No existe esa opcion en la lista'}
                  isMulti
                  isSearchable
                  placeholder="selecionar"
                  onChange={yearsChanges}
                />
              </div>
              <div className="multiselect">
                <label className="legacy">SIGLAS</label>
                <Select
                  id="select1"
                  options={opciones}
                  value={tags}
                  styles={customStyles}
                  noOptionsMessage={() => 'No existe esa opcion en la lista'}
                  isMulti
                  isSearchable
                  placeholder="Seleccionar"
                  onChange={tagsChanges}
                />
              </div>
              <div>
                <div>
                  <label htmlFor="ubicacion">Ubicacion</label>
                  <input
                    id="ubicacion"
                    type="text"
                    pattern="[E][0-9][P][0-9][-][0-9]"
                    placeholder="ubicacion"
                    required
                    value={ubicacion}
                    onChange={e => setUbicacion(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label className="small-label">Proveedor</label>
                  <select
                    className="inline-select producto"
                    id="select-proveedor"
                    value={proveedor}
                    onChange={e => setProveedor(e.target.value)}
                  >
                    {proveedores?.map(x => (
                      <option key={x._id} value={x.nombre}>
                        {x.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row-container imagen">
              <div id="div-tiny-image">
                <img src={imageurl} className="tiny-image" alt=" imagen" />
              </div>
              <div className="grupo-imagen">
                <div>
                  <input type="file" className="custom-file-input" id="imageFile" onChange={uploadFileHandler}></input>
                  {loadingUpload && <LoadingBox></LoadingBox>}
                </div>
                <div>
                  <input
                    id="imageurl"
                    className="cloudinary-url-input"
                    type="text"
                    value={imageurl}
                    onChange={e => setImageurl(e.target.value)}
                    disabled
                  ></input>
                </div>
              </div>
            </div>

            <div>
              <button className="primary" type="submit">
                Actualizar Producto
              </button>
            </div>
          </React.Fragment>
        )}
      </form>
    </div>
  );
}
