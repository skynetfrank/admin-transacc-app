import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { detailsSettings, updateSettings } from '../actions/settingsActions';
import LoadingBox from '../components/LoadingBox';
import { SETTINGS_UPDATE_RESET } from '../constants/settingsConstants';

export default function CambioDiaScreen(props) {
	const navigate = useNavigate();
	const [adminCambio, setAdminCambio] = useState(0);

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const settingsDetails = useSelector((state) => state.settingsDetails);
	const { loading, error, settings } = settingsDetails;

	const settingsUpdate = useSelector((state) => state.settingsUpdate);
	const { loading: loadingUpdate, success } = settingsUpdate;

	const settingsID = '627027f0277631ecd12bf671';

	const dispatch = useDispatch();

	if (!userInfo) {
		navigate('/signin');
	}

	useEffect(() => {
		if (success) {
			dispatch({ type: SETTINGS_UPDATE_RESET });
			navigate('/administrador');
		}
		if (!settings) {
			dispatch(detailsSettings(settingsID));
		} else {
			setAdminCambio(settings.cambioDiaAdmin);
		}
	}, [dispatch, navigate, settings, success]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(updateSettings({ _id: settingsID, cambioDiaAdmin: adminCambio }));
		dispatch(detailsSettings(settingsID));
		navigate('/');
	};

	return (
		<div>
			{loading && <LoadingBox></LoadingBox>}
			<form className='form shipping' onSubmit={submitHandler}>
				<div>
					<h1>Cambio del Dia (Bs./US$)</h1>
				</div>
				<div>
					<label htmlFor='fullName'>Bs./US$</label>
					<input
						type='number'
						id='admin-cambio'
						value={adminCambio}
						onChange={(e) => setAdminCambio(e.target.value)}
						required
					></input>
				</div>
				<div>
					<label />
					<button className='primary' type='submit'>
						{loading ? 'cargando...' : 'Actualizar Cambio del Dia...'}
					</button>
				</div>
			</form>
		</div>
	);
}
