// frontend/src/components/TableApp/TableComponent.jsx
import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import './stylesTable.css';

const TableComponent = ({ columns, data }) => {
  const [selectedCell, setSelectedCell] = useState(null); // Состояние для хранения данных ячейки

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
    setSelectedCell({
      header: cell.column.Header,
      value: cell.value,
    });
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

      {/* Модальное окно */}
      {selectedCell && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#2a2a2a',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          color: '#ffffff',
          zIndex: 1000,
        }}>
          <h3>Вы нажали на ячейку:</h3>
          <p><strong>{selectedCell.header}:</strong> {selectedCell.value}</p>
          <button onClick={closeModal} style={{
            backgroundColor: '#1a73e8',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Закрыть
          </button>
        </div>
      )}
    </>
  );
};

export default TableComponent;