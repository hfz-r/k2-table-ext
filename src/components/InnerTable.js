import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTable, useSortBy } from "react-table";

const Table = ({ parentRow, childData }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "Id",
      },
      {
        Header: "COA",
        accessor: "COA",
      },
      {
        Header: "Type",
        accessor: "Type",
      },
      {
        Header: "Currency",
        accessor: "Currency",
      },
      {
        Header: "AMC",
        accessor: "AMC",
      },
      {
        Header: "Channel",
        accessor: "Channel",
      },
      {
        Header: "Agent",
        accessor: "Agent",
      },
      {
        Header: "Plan",
        accessor: "Plan",
      },
      {
        Header: "DrCr",
        accessor: "DrCr",
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
    <table
      {...getTableProps()}
      style={{
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "floralwhite",
        border: "0.5px solid black",
      }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            key={`headerrow-${headerGroup.key}`}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column, headerIndex) => (
              <th key={`headercol-${headerIndex}`} {...column.getHeaderProps()}>
                <div className="column-wrapper">
                  <div className="column-header">
                    <div
                      {...column.getSortByToggleProps()}
                      className="header-content"
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
                  </div>
                </div>
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
                    {cell.render("Cell")}
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

Table.propTypes = {
  parentRow: PropTypes.object,
  childData: PropTypes.array,
};

const InnerTable = ({ parentRow, parentVisibleColumns, data }) => {
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
  }, [data]);

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

InnerTable.propTypes = {
  parentRow: PropTypes.object,
  parentVisibleColumns: PropTypes.array,
  data: PropTypes.array,
};

export default InnerTable;
