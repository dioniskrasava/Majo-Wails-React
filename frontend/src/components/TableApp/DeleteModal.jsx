// frontend/src/components/TableApp/DeleteModal.jsx
import React from 'react';

const DeleteModal = ({ onConfirm, onClose }) => {
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
      <h3>Вы уверены, что хотите удалить строку?</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onConfirm}
          style={{
            backgroundColor: '#ff4d4d',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Удалить
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#1a73e8',
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

export default DeleteModal;