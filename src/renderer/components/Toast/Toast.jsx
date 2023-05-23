import React from 'react';
import './Toast.scss';
const Toast = ({ start, message, type, button }) => {
  return (
    <div className={start ? 'Toast open' : 'Toast close'}>
      {message}
      <button>update</button>
    </div>
  );
};

export default Toast;
