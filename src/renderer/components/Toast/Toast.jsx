import React from 'react';
import './Toast.scss';
const Toast = ({ start, message, type, button }) => {
  console.log(button);
  return (
    <div className={start ? 'Toast open' : 'Toast close'}>
      {message}
      {button && <button>{button}</button>}
    </div>
  );
};

export default Toast;
