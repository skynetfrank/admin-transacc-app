import Axios from 'axios';
import { MOV_ADD_ITEM, MOV_REMOVE_ITEM } from '../constants/movConstants';

export const addToMov =
	(productId, qty, costousd, cambio) => async (dispatch, getState) => {
		const { data } = await Axios.get(`/api/productos/${productId}`);
		dispatch({
			type: MOV_ADD_ITEM,
			payload: {
				codigo: data.codigo,
				nombre: data.nombre,
				descripcion: data.descripcion,
				imageurl: data.imageurl,
				precio: data.preciousd,
				existencia: data.existencia,
				producto: data._id,
				qty,
				costousd,
				cambio,
				costobs: costousd * cambio,
			},
		});

		localStorage.setItem('movItems', JSON.stringify(getState().mov.movItems));
	};

export const removeFromMov = (productId) => (dispatch, getState) => {
	dispatch({ type: MOV_REMOVE_ITEM, payload: productId });
	localStorage.setItem('movItems', JSON.stringify(getState().mov.movItems));
};
