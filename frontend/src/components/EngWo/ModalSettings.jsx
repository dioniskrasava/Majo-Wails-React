import React from 'react';
import './modalStyles.css';

const ModalSettings = ({ onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h3 className="modal-title">МОДАЛЬНОЕ ОКНО НАСТРОЕК</h3>
        Текст модального окна
      </div>
    </>
  );
};

export default ModalSettings;