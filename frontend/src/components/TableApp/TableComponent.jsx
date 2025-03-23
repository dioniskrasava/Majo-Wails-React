// frontend/src/components/TableApp/TableComponent.jsx
import React, { useState } from 'react';
import { useTable } from 'react-table';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal'; // Новый компонент для удаления
import './stylesTable.css';

const TableComponent = ({ columns, data, onSave, onDelete }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null); // Состояние для выбранной строки
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Состояние для модального окна удаления

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
    event.preventDefault(); // Отключаем стандартное контекстное меню
    setSelectedRow(row); // Сохраняем выбранную строку
    setShowDeleteModal(true); // Показываем модальное окно удаления
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

  // Обработчик удаления строки
  const handleDeleteRow = async () => {
    if (selectedRow) {
      try {
        await onDelete(selectedRow.original.id); // Вызов метода удаления
        closeDeleteModal(); // Закрываем модальное окно
      } catch (error) {
        console.error('Ошибка при удалении строки:', error);
      }
    }
  };

  return (
    <>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className='thClass' {...column.getHeaderProps()}>
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
                onContextMenu={(e) => handleRightClick(row, e)} // Обработчик правого клика
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
    </>
  );
};

export default TableComponent;