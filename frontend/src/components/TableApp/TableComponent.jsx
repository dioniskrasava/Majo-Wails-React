import React, { useState } from 'react';
import { useTable } from 'react-table';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ColumnEditModal from './ColumnEditModal';
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
  } = useTable({
    columns,
    data,
  });

  const handleCellClick = (cell) => {
    setSelectedCell(cell);
  };

  const handleRightClick = (row, event) => {
    event.preventDefault();
    setSelectedRow(row);
    setShowDeleteModal(true);
  };

  const handleColumnDoubleClick = (column) => {
    setSelectedColumn({
      id: column.id,  // или column.accessor
      Header: column.Header
    });
    setShowColumnEditModal(true);
  };

  const closeModal = () => {
    setSelectedCell(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRow(null);
  };

  const closeColumnEditModal = () => {
    setShowColumnEditModal(false);
    setSelectedColumn(null);
  };

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
          {headerGroups.map((headerGroup) => {
            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...headerProps } = column.getHeaderProps();
                  return (
                    <th
                      key={key}
                      className='thClass'
                      {...headerProps}
                      onDoubleClick={() => handleColumnDoubleClick(column)}
                    >
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...rowProps } = row.getRowProps();
            return (
              <tr
                key={key}
                {...rowProps}
                onContextMenu={(e) => handleRightClick(row, e)}
              >
                {row.cells.map((cell) => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td
                      key={key}
                      className='cellTable'
                      {...cellProps}
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