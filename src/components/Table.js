import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  useExpanded,
  useFilters,
  useGroupBy,
  usePagination,
  useTable,
  useSortBy,
} from "react-table";
import { fuzzyTextFilterFn, DefaultColumnFilter } from "./Filters";
import Pagination from "./Pagination";
import { ConnectedMenu, MenuWrapper } from "./Menu";

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
        return rows.filter((row) => {
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
    toggleHideColumn("expander", !!groupBy.length);
  }, [groupBy, toggleHideColumn]);

  return (
    <>
      <ConnectedMenu
        columns={allColumns}
        toggleAll={getToggleHideAllColumnsProps}
      />
      <div className="tableWrap">
        <table {...getTableProps()}>
          <thead className="grid-column-headers">
            {headerGroups.map((headerGroup) => (
              <tr
                key={`headerrow-${headerGroup.key}`}
                className="table-column-headers-wrapper"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, headerIndex) => (
                  <th
                    key={`headercol-${headerIndex}`}
                    {...column.getHeaderProps({
                      className: `grid-column-header-cell ${
                        column.collapse ? "collapse" : ""
                      }`,
                    })}
                  >
                    <div className="column-wrapper grid-column-header-cell-wrapper">
                      <div className="column-header grid-column-header-cell-content">
                        <div
                          {...column.getSortByToggleProps()}
                          className="header-content grid-column-header-text"
                        >
                          {column.render("Header")}
                          <div className="sort-icon-wrapper">
                            {column.isSorted ? (
                              <>
                                <svg
                                  width="10"
                                  height="5"
                                  viewBox="0 0 10 5"
                                  className={`sort-icon sort-icon--asc ${
                                    !column.isSortedDesc && "sort-icon--active"
                                  }`}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.767.276L8.395 4.04c.142.147.138.382-.01.524-.069.066-.16.104-.257.104H.872c-.205 0-.37-.166-.37-.37 0-.097.036-.189.103-.258L4.233.276c.142-.147.377-.151.524-.009l.01.01z"
                                  ></path>
                                </svg>
                                <svg
                                  width="10"
                                  height="5"
                                  viewBox="0 0 10 5"
                                  className={`sort-icon sort-icon--desc ${
                                    column.isSortedDesc && "sort-icon--active"
                                  }`}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.233 4.724L.605.96C.463.814.467.579.615.437.684.371.775.333.872.333h7.256c.205 0 .37.166.37.37 0 .097-.036.189-.103.258L4.767 4.724c-.142.147-.377.151-.524.009l-.01-.01z"
                                  ></path>
                                </svg>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {column.id !== "expander" && (
                          <MenuWrapper
                            key={`menu-${headerIndex}`}
                            column={column}
                          />
                        )}
                      </div>
                      {/* Render the columns filter UI */}
                      <div className="header-filter-wrapper">
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="grid-body-content" {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();
              return (
                <React.Fragment key={`bodyrow-${rowProps.key}`}>
                  <tr className="grid-body-content-wrapper" {...rowProps}>
                    {row.cells.map((cell, cellIndex) => {
                      return (
                        <td
                          key={`bodycol-${cellIndex}`}
                          {...cell.getCellProps({
                            className: cell.column.collapse ? "collapse" : "",
                          })}
                        >
                          <div className="grid-content-cell">
                            {cell.isGrouped ? (
                              <>
                                <span {...row.getToggleRowExpandedProps()}>
                                  {row.isExpanded ? "🔽 " : "▶️ "}
                                </span>
                                {cell.render("Cell")} ({row.subRows.length})
                              </>
                            ) : cell.isAggregated ? (
                              cell.render("Aggregated")
                            ) : cell.isPlaceholder ? null : (
                              cell.render("Cell")
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {row.isExpanded &&
                    renderSubComponent({ row, visibleColumns })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
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
  data: PropTypes.arrayOf(PropTypes.object),
  updateData: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.object),
  skipReset: PropTypes.bool,
  renderSubComponent: PropTypes.func,
};

export default Table;
