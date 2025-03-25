import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import AddDataForm from './AddDataForm';
import useTableStore from '../utils/edrTableStore';
import { toCamelCase } from './utilsEDR/stringUtils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

const TableApp = () => {
  const {
    data,
    columns,
    columnNames,
    setData,
    setColumns,
    setColumnNames,
    updateColumnName,
    isLoading,
    setIsLoading
  } = useTableStore();

  const [showAddModal, setShowAddModal] = useState(false); // окно добавления строки (Состояние)

  // Инициализация таблицы
  useEffect(() => {
    const initializeTable = async () => {
      if (data.length > 0 && Object.keys(columnNames).length > 0) return;
      
      setIsLoading(true);
      try {
        const [namesResponse, tableData] = await Promise.all([
          window.go.main.App.GetColumnNames(),
          window.go.main.App.GetTestData()
        ]);

        const formattedNames = Object.entries(namesResponse).reduce((acc, [key, value]) => {
          acc[toCamelCase(key)] = value;
          return acc;
        }, {});

        setData(tableData);
        setColumnNames(formattedNames);
        
        if (tableData.length > 0) {
          updateColumns(tableData, formattedNames);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeTable();
  }, []);

  // Обновление колонок таблицы
  const updateColumns = (tableData, names = columnNames) => {
    const keys = Object.keys(tableData[0]).filter(key => key !== 'id');
    const newColumns = keys.map(key => ({
      Header: names[key] || capitalizeFirstLetter(key),
      accessor: key,
    }));
    setColumns(newColumns);
  };

  // Загрузка данных таблицы
  const loadData = async () => {
    try {
      const response = await window.go.main.App.GetTestData();
      setData(response);
      if (response.length > 0) {
        updateColumns(response);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  // Загрузка названий столбцов
  const loadColumnNames = async () => {
    try {
      const response = await window.go.main.App.GetColumnNames();
      const formattedNames = Object.entries(response).reduce((acc, [key, value]) => {
        acc[toCamelCase(key)] = value;
        return acc;
      }, {});
      
      setColumnNames(formattedNames);
    } catch (error) {
      console.error("Ошибка загрузки названий:", error);
    }
  };

  // Обработчики действий
  const handleAddData = async (firstName, lastName, age) => {
    try {
      await window.go.main.App.AddTestData(firstName, lastName, age);
      } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
        throw error;
      }
      await loadData();
    };

  const handleSave = async (id, columnName, newValue) => {
    try {
      const columnMapping = {
        firstName: 'first_name',
        lastName: 'last_name',
        age: 'age'
      };

      const dbColumnName = columnMapping[columnName];
      if (!dbColumnName) throw new Error('Недопустимое имя столбца');

      await window.go.main.App.UpdateCellValue(id, dbColumnName, newValue);
      await loadData();
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await window.go.main.App.DeleteRow(id);
      await loadData();
    } catch (error) {
      console.error('Ошибка при удалении строки:', error);
      throw error;
    }
  };

  const handleUpdateColumn = async (column, newDisplayName) => {
    if (!column || !newDisplayName?.trim()) {
      throw new Error('Не указано название столбца');
    }

    try {
      const originalColumnName = column.accessor || column.id;
      const snakeCaseKey = originalColumnName.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      await window.go.main.App.UpdateColumnName(snakeCaseKey, newDisplayName.trim());
      updateColumnName(originalColumnName, newDisplayName.trim());
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      throw error;
    }
  };

  // Вспомогательные функции
  const capitalizeFirstLetter = (string) => 
    string.charAt(0).toUpperCase() + string.slice(1);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="table-app-container">
    <h1>Every Day Routines</h1>
    

    
    <TableComponent
      columns={columns}
      data={data}
      onSave={handleSave}
      onDelete={handleDelete}
      onUpdateColumn={handleUpdateColumn}
    />

    <button 
      onClick={() => setShowAddModal(true)}
      className="modal-button modal-button-primary"
      style={{ marginTop: '20px' }}
    >
      <FontAwesomeIcon icon={faPlus} size='xl' className='iconsSideBar'/>
    </button>

    {showAddModal && (
      <AddDataForm 
        onAdd={handleAddData} 
        onClose={() => setShowAddModal(false)} 
      />
    )}
  </div>
  );
};

export default TableApp;