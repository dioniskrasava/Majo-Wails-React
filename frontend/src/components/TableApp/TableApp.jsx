// frontend/src/components/TableApp/TableApp.jsx
import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import AddDataForm from './AddDataForm';
import useTableStore from '../utils/edrTableStore'; // Импортируем глобальное хранилище
import { toCamelCase } from './utilsEDR/stringUtils'; // Вынесем преобразование в отдельную функцию

const TableApp = () => {

  const {
    data,
    columns,
    columnNames,
    setData,
    setColumns,
    setColumnNames,
    updateColumnName, // Используем новый метод
    isLoading,
    setIsLoading
  } = useTableStore();

 // Загрузка данных из базы данных при монтировании компонента
 useEffect(() => {
  const initializeTable = async () => {
    if (data.length > 0 && Object.keys(columnNames).length > 0) return;
    
    setIsLoading(true);
    try {
      const [namesResponse, tableData] = await Promise.all([
        window.go.main.App.GetColumnNames(),
        window.go.main.App.GetTestData()
      ]);

      const formattedNames = {};
      for (const [key, value] of Object.entries(namesResponse)) {
        formattedNames[toCamelCase(key)] = value;
      }

      setData(tableData);
      setColumnNames(formattedNames);
      
      if (tableData.length > 0) {
        setColumns(
          Object.keys(tableData[0])
            .filter(key => key !== 'id')
            .map(key => ({
              Header: formattedNames[key] || key.charAt(0).toUpperCase() + key.slice(1),
              accessor: key,
            }))
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  initializeTable();
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
    const formattedNames = {};
    
    for (const [key, value] of Object.entries(response)) {
      formattedNames[toCamelCase(key)] = value;
    }
    
    setColumnNames(formattedNames);
    // Не обновляем columns здесь - это сделает updateColumnName
    
  } catch (error) {
    console.error("Ошибка загрузки названий:", error);
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
const handleUpdateColumn = async (column, newDisplayName) => {
  try {
    if (!column || !newDisplayName?.trim()) {
      throw new Error('Не указано название столбца');
    }

    const originalColumnName = column.accessor || column.id;
    const snakeCaseKey = originalColumnName.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // 1. Обновляем в базе данных
    await window.go.main.App.UpdateColumnName(snakeCaseKey, newDisplayName.trim());

    // 2. ТОЛЬКО обновляем Zustand (убираем лишние перезагрузки)
    updateColumnName(originalColumnName, newDisplayName.trim());
    
  } catch (error) {
    console.error('Ошибка при обновлении:', error);
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