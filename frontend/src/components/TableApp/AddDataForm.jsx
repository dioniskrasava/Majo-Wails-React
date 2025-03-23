// frontend/src/components/TableApp/AddDataForm.jsx
import React, { useState } from 'react';

const AddDataForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
  });

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Вызов метода onAdd, переданного из родительского компонента
      await onAdd(formData.firstName, formData.lastName, parseInt(formData.age, 10));

      // Очистка формы после успешного добавления
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
      });

      console.log('Данные успешно добавлены!');
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
      <div>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '5px' }}
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
            style={{ marginLeft: '5px' }}
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
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>
      <button type="submit" style={{ padding: '5px 10px' }}>Добавить</button>
    </form>
  );
};

export default AddDataForm;