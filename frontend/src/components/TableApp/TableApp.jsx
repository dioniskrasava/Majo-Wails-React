//frontend/src/components/TableApp/TableApp.jsx
import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import useTableStore from '../utils/edrTableStore';
import { toCamelCase } from './utilsEDR/stringUtils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

import AddColumnForm from './modal/AddColumnForm';

const TableApp = () => {
  const {
    data,
    columns,
    columnNames,
    setData,
    setColumns,
    setColumnNames,
    updateColumnName,
    updateCellValue,
    isLoading,
    setIsLoading
  } = useTableStore();

  const [showAddModal, setShowAddModal] = useState(false); // окно добавления строки (Состояние)

  // Добавляем обработчик удаления столбца
  const handleDeleteColumn = async (columnName) => {
    try {
      // Убедитесь, что columnName - строка
      if (typeof columnName !== 'string') {
        throw new Error('Некорректное имя столбца');
      }
      
      await window.go.main.App.DeleteColumn('test_data', columnName);
      // ... остальной код обновления данных
    } catch (error) {
      console.error('Ошибка при удалении столбца:', error);
      throw error;
    }
  };

  // Добавляем состояние для модалки
const [showAddColumnModal, setShowAddColumnModal] = useState(false);

// Обработчик добавления столбца
const handleAddColumn = async (columnName, columnType) => {
  try {
    const dbColumnName = columnName.toLowerCase().replace(/ /g, '_');
    
    await window.go.main.App.AddColumn('test_data', dbColumnName, columnType);
    
    // Полная перезагрузка данных и структуры
    const [newData, newNames] = await Promise.all([
      window.go.main.App.GetTableData('test_data'),
      window.go.main.App.GetColumnNames('test_data')
    ]);
    
    // Форматируем имена столбцов
    const formattedNames = Object.entries(newNames).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = value || key;
      return acc;
    }, {});
    
    // Обновляем все состояния атомарно
    setData(newData);
    setColumnNames(formattedNames);
    
    // Обновляем колонки таблицы
    if (newData.length > 0) {
      const keys = Object.keys(newData[0]).filter(key => key !== 'id');
      const newColumns = keys.map(key => ({
        Header: formattedNames[key] || key,
        accessor: key,
      }));
      setColumns(newColumns);
    }
    
    setShowAddColumnModal(false);
  } catch (error) {
    console.error('Ошибка:', error);
    alert(`Ошибка добавления столбца: ${error.message}`);
  }
};

  // Инициализация таблицы
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [data, names] = await Promise.all([
          window.go.main.App.GetTableData('test_data'),
          window.go.main.App.GetColumnNames('test_data')
        ]);
        
        setData(data);
        setColumnNames(names);
        
        if (data.length > 0) {
          updateColumns(data, names);
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Обновление колонок таблицы
  const updateColumns = (tableData, names = columnNames) => {
    if (!tableData || tableData.length === 0) return;
    
    // Получаем ВСЕ ключи из первой строки
    const keys = Object.keys(tableData[0]).filter(key => key !== 'id'); 
    
    const newColumns = keys.map(key => ({
      Header: names[key] || toCamelCase(key),
      accessor: key,
    }));
    
    setColumns(newColumns);
  };

  // Загрузка данных таблицы
  const loadData = async () => {
    try {
      const response = await window.go.main.App.GetTableData('test_data');
      
      // Гарантируем массив
      const tableData = Array.isArray(response) ? response : [];
      
      setData(tableData);
      
      if (tableData.length > 0) {
        const namesResponse = await window.go.main.App.GetColumnNames('test_data');
        const formattedNames = Object.entries(namesResponse).reduce((acc, [key, value]) => {
          acc[toCamelCase(key)] = value;
          return acc;
        }, {});
        
        setColumnNames(formattedNames);
        updateColumns(tableData, formattedNames);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setData([]); // Сбрасываем на пустой массив при ошибке
    }
  };

  // Загрузка названий столбцов
  const loadColumnNames = async () => {
    try {
      const response = await window.go.main.App.GetColumnNames('test_data');
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
  const handleAddData = async () => {
    try {
      // Используем новый метод добавления
      await window.go.main.App.AddEmptyRow('test_data');
      await loadData(); // Полная перезагрузка
      
      // Автоскролл к новой строке
      setTimeout(() => {
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Ошибка добавления:", error);
    }
  };

  const handleSave = async (id, columnName, newValue) => {
    try {
      const dbColumnName = columnName.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      await window.go.main.App.UpdateCellValue(id, dbColumnName, newValue === '' ? null : newValue);
      
      // Обновляем только нужную ячейку через хранилище
      updateCellValue(id, columnName, newValue);
      
    } catch (error) {
      console.error('Ошибка сохранения:', error);
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
  onDeleteColumn={handleDeleteColumn} // Добавляем этот пропс
/>

<button 
  onClick={() => {
    console.log("Клик по кнопке добавления");
    handleAddData();
  }}
  className="modal-button modal-button-primary"
  style={{ marginTop: '20px' }}
>
  <FontAwesomeIcon icon={faPlus} size='xl' className='iconsSideBar'/>
</button>

<button onClick={() => setShowAddColumnModal(true)}>
    Добавить столбец
</button>

{showAddColumnModal && (
    <AddColumnForm 
        onAdd={handleAddColumn}
        onClose={() => setShowAddColumnModal(false)}
    />
)}

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