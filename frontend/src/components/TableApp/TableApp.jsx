// frontend/src/components/TableApp/TableApp.jsx
import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import AddDataForm from './AddDataForm';

const TableApp = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnNames, setColumnNames] = useState({}); // Состояние для пользовательских названий

  // Загрузка данных из базы данных при монтировании компонента
  useEffect(() => {
    loadData();
    loadColumnNames(); // Загружаем пользовательские названия столбцов
  }, []);

  // Функция для загрузки данных ТАБЛИЦЫ EDR
  const loadData = async () => {
    try {
      const response = await window.go.main.App.GetTestData();
      setData(response);

      // Создаем колонки на основе данных и пользовательских названий
      if (response.length > 0) {
        const keys = Object.keys(response[0]).filter(key => key !== 'id'); // Исключаем "id"
        const columns = keys.map(key => ({
          Header: columnNames[key] || key.charAt(0).toUpperCase() + key.slice(1), // Используем пользовательское название, если оно есть
          accessor: key,
        }));
        console.log("Созданные колонки:", columns); // Отладка
        setColumns(columns);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  // Функция для загрузки пользовательских названий столбцов
  const loadColumnNames = async () => {
    try {
      const response = await window.go.main.App.GetColumnNames();
      console.log("Загруженные названия столбцов:", response); // Отладка
  
      // Преобразуем ключи из snake_case в camelCase
      const formattedColumnNames = {};
      for (const [key, value] of Object.entries(response)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        formattedColumnNames[camelCaseKey] = value;
      }
  
      console.log("Преобразованные названия столбцов:", formattedColumnNames); // Отладка
      setColumnNames(formattedColumnNames);
  
      // После загрузки названий обновляем колонки
      if (data.length > 0) {
        const keys = Object.keys(data[0]).filter(key => key !== 'id'); // Исключаем "id"
  
        const columns = keys.map(key => {
          const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
          return {
            Header: formattedColumnNames[camelCaseKey] || key.charAt(0).toUpperCase() + key.slice(1), // Используем пользовательское название, если оно есть
            accessor: key,
          };
        });
        console.log("Созданные колонки:", columns); // Отладка
        setColumns(columns);
      }
    } catch (error) {
      console.error("MY-ERR: Ошибка при загрузке названий столбцов:", error);
    }
  };

  // Обработчик добавления данных
  const handleAddData = async (firstName, lastName, age) => {
    try {
      await window.go.main.App.AddTestData(firstName, lastName, age);
      await loadData();
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  // Обработчик обновления данных
  const handleSave = async (id, columnName, newValue) => {
    try {
      const dbColumnName = columnName === 'firstName' ? 'first_name' :
                          columnName === 'lastName' ? 'last_name' :
                          columnName === 'age' ? 'age' : null;

      if (!dbColumnName) {
        throw new Error('Недопустимое имя столбца');
      }

      await window.go.main.App.UpdateCellValue(id, dbColumnName, newValue);
      await loadData();
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  // Обработчик удаления строки
  const handleDelete = async (id) => {
    try {
      await window.go.main.App.DeleteRow(id);
      await loadData();
    } catch (error) {
      console.error('Ошибка при удалении строки:', error);
    }
  };

  // Обработчик обновления названия столбца
  const handleUpdateColumn = async (columnName, newDisplayName) => {
    try {
      // Преобразуем ключ из camelCase в snake_case
      const snakeCaseKey = columnName.replace(/([A-Z])/g, '_$1').toLowerCase();
      await window.go.main.App.UpdateColumnName(snakeCaseKey, newDisplayName);
      await loadColumnNames(); // Обновляем пользовательские названия
      await loadData(); // Обновляем данные, чтобы применить новые названия
    } catch (error) {
      console.error('Ошибка при обновлении названия столбца:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>My Table</h1>

      {/* Таблица с данными */}
      <TableComponent
        columns={columns}
        data={data}
        onSave={handleSave}
        onDelete={handleDelete}
        onUpdateColumn={handleUpdateColumn}
      />

      {/* Форма для добавления данных */}
      <AddDataForm onAdd={handleAddData} />
    </div>
  );
};

export default TableApp;