import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { summaryOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  faBusinessTime,
  faDollar,
  faDollarSign,
  faFileInvoiceDollar,
  faFileLines,
  faFileSignature,
  faHandHoldingDollar,
  faPerson,
  faUserCheck,
  faUserLarge,
  faUserLargeSlash,
  faUsers,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DashboardScreen() {
  const orderSummary = useSelector(state => state.orderSummary);
  const { loading, summary, error } = orderSummary;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(summaryOrder());
  }, [dispatch]);
  return (
    <div className="div-dashboard">
      <div className="row">
        <h1>Dashboard</h1>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="dash-container">
            <div className="dash-card total1">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Ingresos</h6>
                  <p>Acumulados (año)</p>
                  <h2 id="total-ingresos">$1.234,00</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faDollar} />
                </div>
              </div>
            </div>
            <div className="dash-card total2">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Actividad</h6>
                  <p>Pedidos Efectuados</p>
                  <h2 id="total-procedimientos">934</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                </div>
              </div>
            </div>
            <div className="dash-card total3">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Clientes</h6>
                  <p>Registrados</p>
                  <h2 id="total-pacientes">150</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faUserTie} />
                </div>
              </div>
            </div>
            <div className="dash-card total4">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Cotizaciones</h6>
                  <p>Enviadas</p>
                  <h2 id="total-citas">56</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faFileSignature} />
                </div>
              </div>
            </div>

            <div className="dash-card total5">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Inventario</h6>
                  <p>Existencia Total</p>
                  <h2 id="total-ingresos">$1.234,00</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faDollar} />
                </div>
              </div>
            </div>
            <div className="dash-card total6">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Inventario</h6>
                  <p>Costo Actual</p>
                  <h2 id="total-procedimientos">934</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                </div>
              </div>
            </div>
            <div className="dash-card total7">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Vendedores</h6>
                  <p>Registrados</p>
                  <h2 id="total-pacientes">150</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faUserTie} />
                </div>
              </div>
            </div>
            <div className="dash-card total8">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Cotizaciones</h6>
                  <p>Enviadas</p>
                  <h2 id="total-citas">56</h2>
                </div>
                <div className="dash-info-image">
                  <FontAwesomeIcon icon={faFileSignature} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
