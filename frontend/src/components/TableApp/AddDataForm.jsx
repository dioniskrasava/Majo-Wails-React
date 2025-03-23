// frontend/src/components/TableApp/AddDataForm.jsx
import React, { useState } from 'react';

const AddDataForm = ({ onAdd }) => {
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
      await onAdd(formData.firstName, formData.lastName, parseInt(formData.age, 10));
      setFormData({ firstName: '', lastName: '', age: '' });
      console.log('Данные успешно добавлены!');
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  return (
    <form
      className="add-data-form"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px',
      }}
    >
      <div>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '5px', width: '100px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '5px', width: '100px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '5px', width: '50px' }}
          />
        </label>
      </div>
      <button
        type="submit"
        style={{
          padding: '5px 10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Добавить
      </button>
    </form>
  );
};

export default AddDataForm;