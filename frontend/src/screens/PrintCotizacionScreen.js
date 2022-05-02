import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsCotizacion } from '../actions/cotizacionActions';
import { format } from 'date-fns';
import CotizacionToPrint from '../components/CotizacionToPrint';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

export default function PrintOrderScreen(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const params = useParams();
  const { id: cotizacionId } = params;

  const cotizacionDetails = useSelector(state => state.cotizacionDetails);
  const { cotizacion, loading, error } = cotizacionDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!cotizacion || (cotizacion && cotizacion._id !== cotizacionId)) {
      dispatch(detailsCotizacion(cotizacionId));
    }
  }, [dispatch, cotizacionId, cotizacion]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="printer-container">
      <button className="btn-print" onClick={handlePrint}>
        <FontAwesomeIcon icon={faPrint} />
      </button>
      <CotizacionToPrint order={cotizacion} userInfo={userInfo} ref={componentRef} />
    </div>
  );
}
