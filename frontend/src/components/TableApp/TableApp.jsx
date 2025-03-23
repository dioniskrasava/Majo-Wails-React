// frontend/src/components/TableApp/TableApp.jsx
import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import AddDataForm from './AddDataForm';

const TableApp = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // Загрузка данных из базы данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция для загрузки данных
  const loadData = async () => {
    try {
      const response = await window.go.main.App.GetTestData();
      setData(response);

      // Создание колонок на основе данных
      if (response.length > 0) {
        const keys = Object.keys(response[0]);
        const columns = keys.map(key => ({
          Header: key.charAt(0).toUpperCase() + key.slice(1),
          accessor: key,
        }));
        setColumns(columns);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  // Обработчик добавления данных
  const handleAddData = async (firstName, lastName, age) => {
    try {
      // Вызов метода Go для добавления данных
      await window.go.main.App.AddTestData(firstName, lastName, age);

      // Обновление данных таблицы после добавления новой строки
      await loadData();
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  return (
    <div>
      <h1>My Table</h1>

      {/* Таблица с данными */}
      <TableComponent columns={columns} data={data} />

      {/* Форма для добавления данных */}
      <AddDataForm onAdd={handleAddData} />
    </div>
  );
};

export default TableApp;