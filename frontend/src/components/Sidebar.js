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
	return (
		<div className='sidebar'>
			<div className='sidebar__header'>
				<FontAwesomeIcon icon={faUserShield} id='admin-icon' />
				<p id='admin-title'>Administrador</p>
				<hr />
			</div>
			<div className='sidebar__menu'>
				<Link to='/dashboard'>
					<FontAwesomeIcon icon={faProjectDiagram} />
					<span className='sidebar__menu_texto'>Dashboard</span>
				</Link>
				<Link to='/proveedorlist'>
					<FontAwesomeIcon icon={faUserTie} />
					<span className='sidebar__menu_texto'>Proveedores</span>
				</Link>
				<Link to='/userlist'>
					<FontAwesomeIcon icon={faUsers} />
					<span className='sidebar__menu_texto'>Usuarios</span>
				</Link>
			</div>
		</div>
	);
}

export default Sidebar;
