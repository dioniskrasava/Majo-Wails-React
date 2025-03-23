// frontend/src/components/TableApp/ColumnEditModal.jsx
import React, { useState } from 'react';

const ColumnEditModal = ({ column, onSave, onClose }) => {
  const [newName, setNewName] = useState(column.Header);

  const handleSave = async () => {
    try {
      await onSave(column.accessor, newName); // Передаем статичное имя столбца и новое название
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении названия столбца:', error);
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
      <h3>Редактирование названия столбца</h3>
      <p>
        <strong>Текущее название:</strong> {column.Header}
      </p>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
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

export default ColumnEditModal;