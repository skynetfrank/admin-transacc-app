import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsOrder } from '../actions/orderActions';
import { format } from 'date-fns';
import ComponentToPrint from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function PrintOrderScreen(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const params = useParams();
  const { id: orderId } = params;

  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!order || (order && order._id !== orderId)) {
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, orderId, order]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="printer-container">
      <button className="btn-print" onClick={handlePrint}>
        <FontAwesomeIcon icon={faPrint} />
      </button>
      <ComponentToPrint order={order} userInfo={userInfo} ref={componentRef} />
    </div>
  );
}
