import React from 'react';
import TableComponent from './TableComponent';

const App = () => {
  const data = React.useMemo(
    () => [
      { firstName: 'John', lastName: 'Doe', age: 30 },
      { firstName: 'Jane', lastName: 'Smith', age: 25 },
      { firstName: 'Bob', lastName: 'Johnson', age: 40 },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName', // accessor is the "key" in the data
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

  return (
    <div>
      <h1>My Table</h1>
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

export default App;