// frontend/src/components/TableApp/modal/DeleteColumnModal.jsx
import React from 'react';
import Modal from './Modal';
import './modalStyles.css';

const DeleteColumnModal = ({ columnName, onConfirm, onClose }) => {
  return (
    <Modal title="Подтверждение удаления столбца" onClose={onClose}>
      <p>Вы уверены, что хотите удалить столбец <strong>{columnName}</strong>?</p>
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

export default DeleteColumnModal;