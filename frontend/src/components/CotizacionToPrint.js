import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { isGeneric } from '../utils/isgeneric';

// Create Document Component
const ComponentToPrint = React.forwardRef((props, ref) => {
  console.log('props:', props);
  const order = props.order;
  const userInfo = props.userInfo;
  const getPageMargins = () => {
    const marginTop = '50px';
    const marginRight = '0px';
    const marginBottom = '0px';
    const marginLeft = '30px';
    return `@page { margin: ${marginTop} ${marginRight}  ${marginBottom} ${marginLeft}}`;
  };
  console.log('IMPRESION order:', order);

  const mostrarValor = valor => {
    if (!valor) {
      return;
    }
    const items = valor.map(v => v.value + ', ');
    return items;
  };

  return (
    <div ref={ref}>
      <style>{getPageMargins()}</style>
      <div>
        <div>
          <h1 className="titulo-print">AUTOMOTORES LA CIMA, C.A.</h1>
          <h2 className="subtitulo-print">REPUESTOS Y ACCESORIOS</h2>
          <p className="rif-print">R.I.F. J-40277991-7</p>

          <div>
            <div className="encabezado-print">
              <div className="div-info-doc">
                <p>
                  <strong>COTIZACION:</strong> {order._id.substr(0, 6)} <br />
                  <strong>Emision:</strong> {format(parseISO(props.order.createdAt), 'dd-MM-yyyy')} <br />
                  <strong>Vencimiento:</strong> {format(parseISO(props.order.createdAt), 'dd-MM-yyyy')} <br />
                  <span>Usuario: {order.vendedorInfo.email}</span>
                </p>
              </div>
              <div className="div-info-user">
                <p>
                  <strong>Nombre o Razon Social: </strong> {order.clienteInfo.nombre}
                  <br />
                  <strong>R.I.F.: </strong>
                  {order.clienteInfo.nic} <br />
                  <strong>Telefono: </strong>
                  {order.clienteInfo.telefono} <br />
                  <strong>Direccion: </strong> {order.clienteInfo.direccion}
                  <br />
                  <strong>Condiciones: </strong>
                  {order.clienteInfo.condiciones} <br />
                </p>
              </div>
            </div>
            <div className="titulos-detalle-print">
              <p className="titulo-detalle-codigo">Nro. Parte</p>
              <p className="titulo-detalle-desc">DESCRIPCION</p>
              <p className="titulo-detalle-cant">Cantidad</p>
              <p className="titulo-detalle-precio">Precio</p>
              <p className="titulo-detalle-total">Total Bs.</p>
            </div>
            <ul className="items-print">
              <li>
                <div>
                  <ul>
                    {order.cotizacionItems.map((item, inx) => (
                      <li className="separator-print" key={item.producto + inx}>
                        <div className="row print">
                          <div className="codigo-print">
                            {isGeneric(item.codigo) ? item.codigo.substr(0, item.codigo.indexOf('-')) : item.codigo}
                          </div>

                          <div className="min-30 nombre-producto print">
                            <span className="nombre-marca-print">
                              {item.nombre} ({item.marca}) ({item.ubicacion})
                            </span>
                            <p id="mini-descripcion">{item.descripcion}</p>
                          </div>
                          <div className="qty print">{item.qty}</div>

                          <div className="qty-price print">
                            <p>Bs.{(item.precio * order.cambioDia).toFixed(2)}</p>
                          </div>
                          <div className="qty-price total">
                            <p>Bs.{(item.qty * item.precio * order.cambioDia).toFixed(2)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <br></br>
          </div>

          <div className="bottom-section-print">
            <div className="totales-print">
              <div className="card resumen print"></div>
              <div className="card resumen print">
                <ul>
                  <li>
                    <div className="row">
                      <div>Sub-Total</div>
                      <div>Bs.{(order.itemsPrice * order.cambioDia).toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>I.V.A. 16%</div>
                      <div>Bs.{(order.taxPrice * order.cambioDia).toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>
                        <strong>Total</strong>
                      </div>
                      <div>Bs.{(order.totalPrice * order.cambioDia).toFixed(2)}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-firma-print">
              <p>Cotizacion Recibida por (Firma y cedula): __________________________</p>
            </div>

            <div className="footer-direccion-print">
              <p>
                Av. Roosvelt Interseccion con la Av. La Rambla Edif. Residencia La Ramblas Piso PB, local PB urb. Los
                Rosales. Caracas zona Postal 1040
              </p>
            </div>
            <div className="footer-telefono-print">
              <p>TLEF.: (0212) 633.03.73 / 633.33.85 / 633.31.56 e-mail: automotoreslacima@gmail.com 1040</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentToPrint;
