/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  faHome,
  faUsers,
  faUserShield,
  faBoxes,
  faFileInvoiceDollar,
  faAddressCard,
  faBuilding,
  faIndustry,
  faScrewdriverWrench,
  faDollyBox,
  faFileWaveform,
  faFileSignature,
  faFileImport,
  faFileExport,
  faHandPaper,
  faMoneyBill,
  faProjectDiagram,
  faHammer,
  faPersonWalking,
  faUserTie,
  faDashboard,
  faJetFighter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { detailsSettings } from '../actions/settingsActions';
import LoadingBox from './LoadingBox';

function Sidebar() {
  const dispatch = useDispatch();
  const [fecha, setFecha] = useState('');
  const settingsDetails = useSelector(state => state.settingsDetails);
  const { loading, error, settings } = settingsDetails;

  const settingsID = '626b3af269a4651ff3dd4899';

  useEffect(() => {
    console.log('sibar triggered:');
    setFecha(format(new Date(), 'dd-MM-yyyy'));
    if (!settings) {
      dispatch(detailsSettings(settingsID));
    }
  }, [dispatch, settings]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <FontAwesomeIcon icon={faUserShield} id="admin-icon" />
        <p id="admin-title">Administrador</p>
        <div className="div-admin-cambio">
          {<p className="admin-cambio-dia">cambio manual:</p>}
          {loading ? (
            <p className="admin-cambio-dia">cargando...</p>
          ) : (
            <p className="admin-cambio-dia">US$: {(settings?.cambioDiaAdmin).toFixed(2)}</p>
          )}
        </div>
        <hr />
      </div>
      <div className="sidebar__menu">
        <Link to="/dashboard">
          <FontAwesomeIcon icon={faProjectDiagram} />
          <span className="sidebar__menu_texto">Dashboard</span>
        </Link>
        <Link to="/productlist">
          <FontAwesomeIcon icon={faBoxes} />
          <span className="sidebar__menu_texto">Productos</span>
        </Link>
        <Link to="/orderlist">
          <FontAwesomeIcon icon={faFileInvoiceDollar} />
          <span className="sidebar__menu_texto">Pedidos</span>
        </Link>
        <Link to="/cotizacionList">
          <FontAwesomeIcon icon={faHammer} />
          <span className="sidebar__menu_texto">Cotizaciones</span>
        </Link>
        <Link to="/entradalist">
          <FontAwesomeIcon icon={faDollyBox} />
          <span className="sidebar__menu_texto">Entradas</span>
        </Link>
        <Link to="/clientelist">
          <FontAwesomeIcon icon={faUserTie} />
          <span className="sidebar__menu_texto">Clientes</span>
        </Link>
        <Link to="/proveedorlist">
          <FontAwesomeIcon icon={faIndustry} />
          <span className="sidebar__menu_texto">Proveedores</span>
        </Link>
        <Link to="/userlist">
          <FontAwesomeIcon icon={faUsers} />
          <span className="sidebar__menu_texto">Usuarios</span>
        </Link>
        <Link to={`/settings/${settingsID}`}>
          <FontAwesomeIcon icon={faScrewdriverWrench} />
          <span className="sidebar__menu_texto">Configurar</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
