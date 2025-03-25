//frontend/src/components/TableApp/TableComponent.jsx
import React, { useState } from 'react';
import { useTable } from 'react-table';
import EditModal from './modal/EditModal';
import DeleteModal from './modal/DeleteModal';
import ColumnEditModal from './modal/ColumnEditModal';
import './stylesTable.css';

const TableComponent = ({ columns, data, onSave, onDelete, onUpdateColumn }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showColumnEditModal, setShowColumnEditModal] = useState(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  // Обработчики событий
  const handleCellClick = (cell) => setSelectedCell(cell);

  const handleRightClick = (row, event) => {
    event.preventDefault();
    setSelectedRow(row);
    setShowDeleteModal(true);
  };

  const handleColumnDoubleClick = (column) => {
    setSelectedColumn({
      id: column.id,
      Header: column.Header
    });
    setShowColumnEditModal(true);
  };

  // Закрытие модальных окон
  const closeModal = () => setSelectedCell(null);
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRow(null);
  };
  const closeColumnEditModal = () => {
    setShowColumnEditModal(false);
    setSelectedColumn(null);
  };

  // Обработка действий
  const handleDeleteRow = async () => {
    if (!selectedRow) return;
    
    try {
      await onDelete(selectedRow.original.id);
      closeDeleteModal();
    } catch (error) {
      console.error('Ошибка при удалении строки:', error);
    }
  };

  const handleUpdateColumn = async (oldName, newName) => {
    try {
      await onUpdateColumn(oldName, newName);
      closeColumnEditModal();
    } catch (error) {
      console.error('Ошибка при обновлении названия столбца:', error);
    }
  };

  // Рендер ячейки
  const renderCell = (cell) => {
    const { key, ...cellProps } = cell.getCellProps();
    return (
      <td
        key={key}
        className="cellTable"
        {...cellProps}
        onClick={() => handleCellClick(cell)}
      >
        {cell.render('Cell')}
      </td>
    );
  };

  // Рендер строки
  const renderRow = (row) => {
    prepareRow(row);
    const { key, ...rowProps } = row.getRowProps();
    return (
      <tr
        key={key}
        {...rowProps}
        onContextMenu={(e) => handleRightClick(row, e)}
      >
        {row.cells.map(renderCell)}
      </tr>
    );
  };

  // Рендер заголовка столбца
  const renderHeader = (column) => {
    const { key, ...headerProps } = column.getHeaderProps();
    return (
      <th
        key={key}
        className="thClass"
        {...headerProps}
        onDoubleClick={() => handleColumnDoubleClick(column)}
      >
        {column.render('Header')}
      </th>
    );
  };

  // Рендер группы заголовков
  const renderHeaderGroup = (headerGroup) => {
    const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
    return (
      <tr key={key} {...headerGroupProps}>
        {headerGroup.headers.map(renderHeader)}
      </tr>
    );
  };

  return (
    <>
      <table {...getTableProps()} className="table">
        <thead>{headerGroups.map(renderHeaderGroup)}</thead>
        <tbody {...getTableBodyProps()}>{rows.map(renderRow)}</tbody>
      </table>

      {selectedCell && (
        <EditModal cell={selectedCell} onSave={onSave} onClose={closeModal} />
      )}

      {showDeleteModal && (
        <DeleteModal onConfirm={handleDeleteRow} onClose={closeDeleteModal} />
      )}

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