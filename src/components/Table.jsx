/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useExpanded,
  useFilters,
  useGroupBy,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import { fuzzyTextFilterFn, DefaultColumnFilter } from './Filters';
import IndeterminateCheckbox from './Checkbox';
import Pagination from './Pagination';

const Table = ({
  columns,
  data,
  updateData,
  skipReset,
  renderSubComponent,
}) => {
  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLocaleLowerCase()
                .startsWith(String(filterValue).toLocaleLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    toggleHideColumn,
    visibleColumns,
    allColumns,
    getToggleHideAllColumnsProps,
    state: { pageIndex, pageSize, groupBy },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      updateData,
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination
  );

  useEffect(() => {
    toggleHideColumn('expander', !!groupBy.length);
  }, [groupBy]);

  return (
    <>
      <div>
        <div>
          <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
          All
        </div>
        {allColumns.map(column => (
          <div key={column.id}>
            <label htmlFor="checkbox">
              <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
              {column.id}
            </label>
          </div>
        ))}
        <br />
      </div>
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
                  {...column.getHeaderProps()}
                >
                  {/* Render the columns group-by and sort-by */}
                  <div>
                    {column.canGroupBy ? (
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? '🔸 ' : '🔹 '}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '🔻 '
                          : '🔺 '
                        : ''}
                      {column.render('Header')}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            const rowProps = row.getRowProps();
            return (
              <React.Fragment key={`bodyrow-${rowProps.key}`}>
                <tr {...rowProps}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td key={`bodycol-${cellIndex}`} {...cell.getCellProps()}>
                        {cell.isGrouped ? (
                          <>
                            <span {...row.getToggleRowExpandedProps()}>
                              {row.isExpanded ? '🔽 ' : '▶️ '}
                            </span>
                            {cell.render('Cell')} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          cell.render('Aggregated')
                        ) : cell.isPlaceholder ? null : (
                          cell.render('Cell')
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded && renderSubComponent({ row, visibleColumns })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <Pagination
        gotoPage={gotoPage}
        previousPage={previousPage}
        nextPage={nextPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </>
  );
};

Table.propTypes = {
  data: PropTypes.shape,
  updateData: PropTypes.shape,
  columns: PropTypes.shape,
  skipReset: PropTypes.bool,
  renderSubComponent: PropTypes.node,
};

export default Table;
