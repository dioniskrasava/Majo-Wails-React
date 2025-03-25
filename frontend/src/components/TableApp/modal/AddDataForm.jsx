// frontend/src/components/TableApp/AddDataForm.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import './modalStyles.css';

const AddDataForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd(
        formData.firstName, 
        formData.lastName, 
        parseInt(formData.age, 10)
      );
      setFormData({ firstName: '', lastName: '', age: '' });
      onClose(); // Закрываем модалку после успешного добавления
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  return (
    <Modal title="Добавление новых данных" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-group">
          <label className="modal-label">
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="modal-input"
            />
          </label>
        </div>
        
        <div className="modal-form-group">
          <label className="modal-label">
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="modal-input"
            />
          </label>
        </div>
        
        <div className="modal-form-group">
          <label className="modal-label">
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              className="modal-input"
              min="1"
            />
          </label>
        </div>
        
        <div className="modal-buttons">
          <button
            type="submit"
            className="modal-button modal-button-primary"
          >
            Добавить
          </button>
          <button
            type="button"
            onClick={onClose}
            className="modal-button modal-button-danger"
          >
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDataForm;