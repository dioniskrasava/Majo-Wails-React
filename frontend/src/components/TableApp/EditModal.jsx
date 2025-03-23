// frontend/src/components/TableApp/EditModal.jsx
import React, { useState } from 'react';

const EditModal = ({ cell, onSave, onClose }) => {
  const [newValue, setNewValue] = useState(cell.value);

  const handleSave = async () => {
    console.log('Кнопка "Сохранить" нажата'); // Отладка
    try {
      await onSave(cell.row.original.id, cell.column.id, newValue);
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#2a2a2a',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      color: '#ffffff',
      zIndex: 1000,
    }}>
      <h3>Редактирование ячейки</h3>
      <p>
        <strong>{cell.column.Header}:</strong> {cell.value}
      </p>
      <input
        type="text"
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        style={{
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '100%',
          marginBottom: '10px',
        }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#1a73e8',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Сохранить
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#ff4d4d',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default EditModal;