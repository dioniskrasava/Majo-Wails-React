import React, { useState, useEffect } from 'react';

const ColumnEditModal = ({ column, onSave, onClose }) => {
  const [newName, setNewName] = useState(column.Header || '');
  const [isValid, setIsValid] = useState(false);

  // Проверяем валидность введенного имени
  useEffect(() => {
    setIsValid(newName.trim().length > 0 && newName !== column.Header);
  }, [newName, column.Header]);

  const handleSave = () => {
    if (isValid) {
      onSave(column, newName); // Передаем весь объект столбца и новое имя
      onClose();
    }
  };

  return (
    <div style={modalStyle}>
      <h3>Редактирование названия столбца</h3>
      <p>
        <strong>Текущее название:</strong> {column.Header}
      </p>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={inputStyle}
      />
      <div style={buttonsStyle}>
        <button
          onClick={handleSave}
          disabled={!isValid}
          style={{
            ...buttonStyle,
            backgroundColor: isValid ? '#1a73e8' : '#cccccc',
            cursor: isValid ? 'pointer' : 'not-allowed'
          }}
        >
          Сохранить
        </button>
        <button
          onClick={onClose}
          style={{
            ...buttonStyle,
            backgroundColor: '#ff4d4d'
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

// Стили вынесены отдельно для читаемости
const modalStyle = {
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
  minWidth: '300px'
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
  margin: '10px 0',
  fontSize: '16px'
};

const buttonsStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const buttonStyle = {
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default ColumnEditModal;