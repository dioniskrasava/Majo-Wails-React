// frontend/src/components/TableApp/Modal.jsx
import React from 'react';
import './modalStyles.css';

const Modal = ({ title, children, onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        {children}
      </div>
    </>
  );
};

export default Modal;