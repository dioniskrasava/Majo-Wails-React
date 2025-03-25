// frontend/src/components/TableApp/EditModal.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import './modalStyles.css';

const EditModal = ({ cell, onSave, onClose }) => {
  const [newValue, setNewValue] = useState(cell.value);

  const handleSave = async () => {
    try {
      await onSave(cell.row.original.id, cell.column.id, newValue);
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  return (
    <Modal title="Редактирование ячейки" onClose={onClose}>
      <p>
        <strong>{cell.column.Header}:</strong> {cell.value}
      </p>
      <input
        type="text"
        className="modal-input"
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          onClick={handleSave}
          className="modal-button modal-button-primary"
        >
          Сохранить
        </button>
        <button
          onClick={onClose}
          className="modal-button modal-button-danger"
        >
          Отмена
        </button>
      </div>
    </Modal>
  );
};

export default EditModal;