// frontend/src/components/TableApp/TableComponent.jsx
import React, { useState } from 'react';
import { useTable } from 'react-table';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ColumnEditModal from './ColumnEditModal'; // Новый компонент для редактирования столбцов
import './stylesTable.css';

const TableComponent = ({ columns, data, onSave, onDelete, onUpdateColumn }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null); // Состояние для выбранного столбца
  const [showColumnEditModal, setShowColumnEditModal] = useState(false); // Состояние для модального окна редактирования столбца

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Обработчик клика по ячейке (левая кнопка)
  const handleCellClick = (cell) => {
    setSelectedCell(cell);
  };

  // Обработчик правого клика по строке
  const handleRightClick = (row, event) => {
    event.preventDefault();
    setSelectedRow(row);
    setShowDeleteModal(true);
  };

  // Обработчик двойного клика по заголовку столбца
  const handleColumnDoubleClick = (column) => {
    setSelectedColumn(column);
    setShowColumnEditModal(true);
  };

  // Закрытие модального окна редактирования
  const closeModal = () => {
    setSelectedCell(null);
  };

  // Закрытие модального окна удаления
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRow(null);
  };

  // Закрытие модального окна редактирования столбца
  const closeColumnEditModal = () => {
    setShowColumnEditModal(false);
    setSelectedColumn(null);
  };

  // Обработчик удаления строки
  const handleDeleteRow = async () => {
    if (selectedRow) {
      try {
        await onDelete(selectedRow.original.id);
        closeDeleteModal();
      } catch (error) {
        console.error('Ошибка при удалении строки:', error);
      }
    }
  };

  // Обработчик обновления названия столбца
  const handleUpdateColumn = async (oldName, newName) => {
    try {
      await onUpdateColumn(oldName, newName);
      closeColumnEditModal();
    } catch (error) {
      console.error('Ошибка при обновлении названия столбца:', error);
    }
  };

  return (
    <>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  className='thClass'
                  {...column.getHeaderProps()}
                  onDoubleClick={() => handleColumnDoubleClick(column)} // Обработчик двойного клика
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onContextMenu={(e) => handleRightClick(row, e)}
              >
                {row.cells.map(cell => {
                  return (
                    <td
                      className='cellTable'
                      {...cell.getCellProps()}
                      onClick={() => handleCellClick(cell)}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Модальное окно для редактирования */}
      {selectedCell && (
        <EditModal
          cell={selectedCell}
          onSave={onSave}
          onClose={closeModal}
        />
      )}

      {/* Модальное окно для удаления */}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteRow}
          onClose={closeDeleteModal}
        />
      )}

      {/* Модальное окно для редактирования столбца */}
      {showColumnEditModal && (
        <ColumnEditModal
          column={selectedColumn}
          onSave={handleUpdateColumn}
          onClose={closeColumnEditModal}
        />
      )}
    </>
  );
};

export default TableComponent;