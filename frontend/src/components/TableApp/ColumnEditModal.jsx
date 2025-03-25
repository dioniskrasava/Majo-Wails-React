// frontend/src/components/TableApp/ColumnEditModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './modalStyles.css';

const ColumnEditModal = ({ column, onSave, onClose }) => {
  const [newName, setNewName] = useState(column.Header || '');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(newName.trim().length > 0 && newName !== column.Header);
  }, [newName, column.Header]);

  const handleSave = () => {
    if (isValid) {
      onSave(column, newName);
      onClose();
    }
  };

  return (
    <Modal title="Редактирование названия столбца" onClose={onClose}>
      <p>
        <strong>Текущее название:</strong> {column.Header}
      </p>
      <input
        type="text"
        className="modal-input"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`modal-button ${isValid ? 'modal-button-primary' : ''}`}
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

export default ColumnEditModal;