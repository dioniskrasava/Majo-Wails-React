// frontend/src/components/TableApp/DeleteModal.jsx
import React from 'react';
import Modal from './Modal';
import './modalStyles.css';

const DeleteModal = ({ onConfirm, onClose }) => {
  return (
    <Modal title="Подтверждение удаления" onClose={onClose}>
      <p>Вы уверены, что хотите удалить строку?</p>
      <div className="modal-buttons">
        <button
          onClick={onConfirm}
          className="modal-button modal-button-danger"
        >
          Удалить
        </button>
        <button
          onClick={onClose}
          className="modal-button modal-button-primary"
        >
          Отмена
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;