import React from 'react';
import TableComponent from './TableComponent';

const TableApp = () => {

  // создание данных для таблицы
  // useMemo - хук для запоминания значений
  const data = React.useMemo(
    () => [
      { firstName: 'John', lastName: 'Doe', age: 30 },
      { firstName: 'Jane', lastName: 'Smith', age: 25 },
      { firstName: 'Bob', lastName: 'Johnson', age: 40 },
    ],
    []
  );

  // создание колонок для таблицы
  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name', // заголовок колонки
        accessor: 'firstName', // ключ данных, который будет отображаться в этой колонке
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
    ],
    []
  );

  // рендер компонента
  return (
    <div>
      <h1>My Table</h1>
      {/* Передача данных и колонок в TableComponent */}
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

export default TableApp;