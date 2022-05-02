import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import CheckoutSteps from '../components/CheckoutSteps';
import { format } from 'date-fns';
import { faTowerBroadcast } from '@fortawesome/free-solid-svg-icons';
import { detailsEntrada } from '../actions/entradaActions';

export default function EntradaView(props) {
  const params = useParams();
  const { id: entradaId } = params;
  const entradaDetails = useSelector(state => state.entradaDetails);
  const { entrada, loading, error } = entradaDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  console.log('entrada:', entrada, 'entradaId:', entradaId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsEntrada(entradaId));
  }, [dispatch, entradaId]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row top">
        <div className="col-2">
          <div className="div-info-user">
            <h2>
              Nota de Entrada No: {entrada.notaNumero} <br />
            </h2>
            <p>
              <strong>Fecha: </strong> {format(new Date(entrada.fechaMovimiento), 'dd-MM-yyyy')} <br />
              <strong>Tipo de Movimiento: </strong> {entrada.tipoMovimiento}
              <br />
              <strong>Tipo de Documento: </strong> {entrada.tipoDoc} <br />
              <strong>Numero de Documento: </strong> {entrada.numeroDocumento} <br />
              <strong>Proveedor: </strong> {entrada.proveedor} <br />
            </p>
          </div>
          <ul>
            <li>
              <h2>Productos Cargados al Inventario</h2>
              <div>
                <ul className="carrito-ul">
                  {entrada.entradaItems.map((item, inx) => (
                    <li key={item.producto + inx}>
                      <div className="row shadow entrada-view">
                        <div>
                          <img src={item.imageurl} alt="foto" className="small"></img>
                        </div>
                        <div className="min-30 entrada-view">
                          <Link to={`/product/${item.producto}`}>{item.nombre}</Link>
                        </div>
                        <div className="qty-price">
                          <p>Costo Bs.: {item.costobs.toFixed(2)}</p>
                        </div>

                        <div className="qty-price">
                          <p>
                            {' '}
                            {item.qty} x ${item.costousd} = ${item.qty * item.costousd}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col1-place-order">
          <div className="card resumen">
            <ul>
              <li>
                <div className="row center">
                  <h1>Resumen</h1>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Articulos</div>
                  <div>({entrada.entradaItems.reduce((a, c) => a + c.qty, 0)} Articulos)</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Total US$</div>
                  <div>${entrada.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Cambio del Dia</div>
                  <div>{entrada.cambio.toFixed(2)} Bs./$</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Total Bs.</strong>
                  </div>
                  <div>
                    <strong>${entrada.montoTotalBs.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
