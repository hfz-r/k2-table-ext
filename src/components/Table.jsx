/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';

const Table = props => {
  const { columns, data, resource } = props;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  key={column.id}
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
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
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      key={cell.value}
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        background: 'papayawhip',
                      }}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Suspense fallback={<div>⏳</div>}>
        <span>{console.log(resource.payload.read())}</span>
      </Suspense>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.shape,
  data: PropTypes.shape,
  resource: PropTypes.shape,
};

export default Table;
