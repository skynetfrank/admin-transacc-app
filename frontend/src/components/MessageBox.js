import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function MessageBox(props) {
  return (
    <div className={`alert alert-${props.variant || 'info'}`}>
      <FontAwesomeIcon icon={faExclamationTriangle} />
      {props.children}
    </div>
  );
}

export default MessageBox;
