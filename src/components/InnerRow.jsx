/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTable, useSortBy } from 'react-table';

const Table = ({ parentRow, childData }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'Id',
      },
      {
        Header: 'COA',
        accessor: 'COA',
      },
      {
        Header: 'Type',
        accessor: 'Type',
      },
      {
        Header: 'Currency',
        accessor: 'Currency',
      },
      {
        Header: 'AMC',
        accessor: 'AMC',
      },
      {
        Header: 'Channel',
        accessor: 'Channel',
      },
      {
        Header: 'Agent',
        accessor: 'Agent',
      },
      {
        Header: 'Plan',
        accessor: 'Plan',
      },
      {
        Header: 'DrCr',
        accessor: 'DrCr',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: childData,
      },
      useSortBy
    );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr
            key={`headerrow-${headerGroup.key}`}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column, headerIndex) => (
              <th
                key={`headercol-${headerIndex}`}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔻' : ' 🔺') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, bodyIndex) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={`bodyrow-${bodyIndex}`}>
              {row.cells.map((cell, cellIndex) => {
                return (
                  <td key={`bodycol-${cellIndex}`} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const InnerRow = ({ parentRow, parentVisibleColumns, data }) => {
  const [loading, setLoading] = React.useState(true);
  const [childData, setChildDate] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChildDate(data);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <tr>
        <td colSpan={parentVisibleColumns.length}>
          <div>⏳</div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr>
        <td colSpan={parentVisibleColumns.length}>
          <Table parentRow={parentRow} childData={childData} />
        </td>
      </tr>
    </>
  );
};

InnerRow.propTypes = {
  parentRow: PropTypes.shape,
  parentVisibleColumns: PropTypes.shape,
  data: PropTypes.shape,
};

Table.propTypes = {
  parentRow: PropTypes.shape,
  childData: PropTypes.shape,
};

export default InnerRow;
