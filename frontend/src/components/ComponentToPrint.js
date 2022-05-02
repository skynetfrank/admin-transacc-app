import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { isGeneric } from '../utils/isgeneric';

// Create Document Component
const ComponentToPrint = React.forwardRef((props, ref) => {
  const [doc, setDoc] = useState('');
  const { search } = useLocation();
  const tipoDoc = new URLSearchParams(search).get('tipo');

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
  useEffect(() => {
    if (tipoDoc === 'factura') {
      setDoc('FACTURA');
    }
    if (tipoDoc === 'notaentrega') {
      setDoc('NOTA DE ENTREGA');
    }
    if (tipoDoc === 'notaalmacen') {
      setDoc('NOTA DE ALMACEN');
    }
    if (tipoDoc === 'pedido') {
      setDoc('PEDIDO');
    }
  }, [tipoDoc]);

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
          {doc === 'FACTURA' ? (
            <h1 className="transparente">i</h1>
          ) : (
            <h1 className="titulo-print">AUTOMOTORES LA CIMA, C.A.</h1>
          )}
          {doc === 'FACTURA' ? (
            <h2 className="transparente">i</h2>
          ) : (
            <h2 className="subtitulo-print">REPUESTOS Y ACCESORIOS</h2>
          )}
          {doc === 'FACTURA' ? <p className="transparente">i</p> : <p className="rif-print">R.I.F. J-40277991-7</p>}

          <div>
            <div className="encabezado-print">
              <div className="div-info-doc">
                <p>
                  <strong>{doc}:</strong> {order._id.substr(0, 6)} <br />
                  <strong>Emision:</strong> {format(parseISO(props.order.createdAt), 'dd-MM-yyyy')} <br />
                  <strong>Vencimiento:</strong> {format(parseISO(props.order.createdAt), 'dd-MM-yyyy')} <br />
                  {order.vendedorInfo.isVendedor ? (
                    <span>
                      Vendedor: {order.vendedorInfo.nombre},{order.vendedorInfo.apellido}
                    </span>
                  ) : (
                    <span>Usuario: {order.vendedorInfo.email}</span>
                  )}
                </p>
              </div>
              <div className="div-info-user">
                <p>
                  <strong>Nombre o Razon Social: </strong>{' '}
                  {order.isVendedor ? order.clienteInfo.nombre : userInfo.nombre + ' ' + userInfo.apellido}
                  <br />
                  <strong>R.I.F.: </strong>
                  {order.isVendedor ? order.clienteInfo.nic : userInfo.cedula} <br />
                  <strong>Telefono: </strong>
                  {order.isVendedor ? order.clienteInfo.telefono : userInfo.telefono} <br />
                  <strong>Direccion: </strong>{' '}
                  {order.isVendedor ? order.clienteInfo.direccion : order.shippingAddress.address}
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode},{order.shippingAddress?.country}
                  <br />
                  <strong>Condiciones: </strong>
                  {order.isVendedor ? order.clienteInfo.condiciones : 'De Contado'} <br />
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
                    {order.orderItems.map((item, inx) => (
                      <li className="separator-print" key={item.producto + inx}>
                        <div className="row print">
                          <div className="codigo-print">
                            {isGeneric(item.codigo)
                              ? item.codigo.substr(0, item.codigo.indexOf('-'))
                              : item.codigo}                          
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
            {order.paymentResult.fechaTransferencia && (
              <p className="noMargin">
                Informacion de Pago (pagado el: {format(parseISO(order.paymentResult.fechaTransferencia), 'dd-MM-yyyy')}
                )
              </p>
            )}
            <div className="totales-print">
              <div className="card resumen print">
                {order.paymentResult.fechaTransferencia && (
                  <ul className="detalle-pago-print">
                    <li>
                      <div className="row">
                        <div>Metodo de Pago: {order.paymentMethod}</div>
                      </div>
                    </li>
                    {order.paymentResult.banco && (
                      <li>
                        <div className="row">
                          <div>Banco: {order.paymentResult.banco}</div>
                        </div>
                      </li>
                    )}
                    {order.paymentResult.referencia && (
                      <li>
                        <div className="row">
                          <div>Referencia: {order.paymentResult.referencia}</div>
                        </div>
                      </li>
                    )}
                    {order.paymentResult.montotransfer && (
                      <li>
                        <div className="row">
                          <div>Monto Depositado: {order.paymentResult.montotransfer}</div>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
                {order.paymentResult.refpagomobil && (
                  <ul className="detalle-pago-print">
                    <li>
                      <div className="row">
                        <div>Referencia: {order.paymentResult.refpagomobil}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Monto Pago-Mobil: {order.paymentResult.montopagomobil}</div>
                      </div>
                    </li>
                  </ul>
                )}
                {order.paymentResult.refzelle && (
                  <ul className="detalle-pago-print">
                    <li>
                      <div className="row">
                        <div>Referencia-Zelle: {order.paymentResult.refzelle}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Titular-Zelle: {order.paymentResult?.cuentazelle}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Monto-Zelle: ${(order.paymentResult?.montozelle).toFixed(2)}</div>
                      </div>
                    </li>
                  </ul>
                )}

                {order.paymentResult.refpagoefectivo && (
                  <ul className="detalle-pago-print">
                    <li>
                      <div className="row">
                        <div>Monedas Recibidas: {mostrarValor(order.paymentResult.monedas)}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Detalle del Pago: {order.paymentResult.refpagoefectivo}</div>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
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
              <p>Articulos Recibidos por (Firma y cedula): __________________________</p>
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
