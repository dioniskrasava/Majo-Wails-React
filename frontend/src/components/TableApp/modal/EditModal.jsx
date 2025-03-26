import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './modalStyles.css';

const EditModal = ({ cell, onSave, onClose }) => {
  // Обрабатываем null/undefined значения
  const initialValue = cell.value === null || cell.value === undefined ? '' : cell.value;
  const [newValue, setNewValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  // Дополнительная проверка при изменении ячейки
  useEffect(() => {
    setNewValue(cell.value === null || cell.value === undefined ? '' : cell.value);
  }, [cell]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Преобразуем пустую строку в null для числовых полей
      const valueToSave = typeof cell.value === 'number' && newValue === '' 
        ? null 
        : newValue;
      
      await onSave(cell.row.original.id, cell.column.id, valueToSave);
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Определяем тип input в зависимости от типа данных
  const inputType = typeof cell.value === 'number' ? 'number' : 'text';

  return (
    <Modal title={`Редактирование: ${cell.column.Header}`} onClose={onClose}>
      <div className="edit-modal-content">
        <div className="form-group">
          <label>Текущее значение:</label>
          <div className="current-value">
            {cell.value === null || cell.value === undefined ? '<пусто>' : cell.value}
          </div>
        </div>

        <div className="form-group">
          <label>Новое значение:</label>
          <input
            type={inputType}
            className="modal-input"
            value={newValue}
            onChange={(e) => setNewValue(inputType === 'number' ? e.target.valueAsNumber : e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-buttons">
          <button
            onClick={handleSave}
            className="modal-button modal-button-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            onClick={onClose}
            className="modal-button modal-button-danger"
          >
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;