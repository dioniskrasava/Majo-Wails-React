// frontend/src/components/TableApp/TableComponent.jsx
import React, { useState } from 'react';
import { useTable } from 'react-table';
import EditModal from './EditModal';
import './stylesTable.css';

const TableComponent = ({ columns, data, onSave }) => {
  const [selectedCell, setSelectedCell] = useState(null);

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

  const closeModal = () => {
    setSelectedCell(null);
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
              <tr {...row.getRowProps()}>
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
    </>
  );
};

export default TableComponent;