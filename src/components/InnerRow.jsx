/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTable, useSortBy } from 'react-table';

const InnerRow = ({ parentRow, data }) => {
  // parent columns
  const columns = useMemo(() => [
    {
      Header: 'Id',
      accessor: 'children[0].Id',
    },
    {
      Header: 'COA',
      accessor: 'children[0].COA',
    },
    {
      Header: 'Type',
      accessor: 'children[0].Type',
    },
    {
      Header: 'Currency',
      accessor: 'children[0].Currency',
    },
    {
      Header: 'AMC',
      accessor: 'children[0].AMC',
    },
    {
      Header: 'Channel',
      accessor: 'children[0].Channel',
    },
    {
      Header: 'Agent',
      accessor: 'children[0].Agent',
    },
    {
      Header: 'Plan',
      accessor: 'children[0].Plan',
    },
    {
      Header: 'DrCr',
      accessor: 'children[0].DrCr',
    },
  ]);

  //   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //     useTable(
  //       {
  //         columns,
  //         data: [parentRow],
  //       },
  //       useSortBy
  //     );

  return (
    <>
      {console.log(data)}
      <tr>
        <td colSpan={6}>
          <table style={{ border: 'solid 1px blue', margin: '20px' }}>
            <tbody>
              {data.map((x, i) => {
                return (
                  <tr key={`expanded-${i}`}>
                    {parentRow.cells.map((cell, ci) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={`body-${ci}`}
                          style={{
                            padding: '10px',
                            border: 'solid 1px gray',
                            background: 'papayawhip',
                          }}
                        >
                          {cell.render(
                            cell.column.SubCell ? 'SubCell' : 'Cell',
                            {
                              value:
                                cell.column.accessor &&
                                cell.column.accessor(x, i),
                              row: { ...parentRow, original: x },
                            }
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </td>
      </tr>
    </>
    // <tr>
    //   <td colSpan={6}>
    //     <table
    //       {...getTableProps()}
    //       style={{ border: 'solid 1px blue', margin: '20px' }}
    //     >
    //       <thead>
    //         {headerGroups.map(headerGroup => (
    //           <tr
    //             key={`headerrow-${headerGroup.key}`}
    //             {...headerGroup.getHeaderGroupProps()}
    //           >
    //             {headerGroup.headers.map((column, headerIndex) => (
    //               <th
    //                 {...column.getHeaderProps(column.getSortByToggleProps())}
    //                 key={`headercol-${headerIndex}`}
    //                 style={{
    //                   borderBottom: 'solid 3px red',
    //                   background: 'aliceblue',
    //                   color: 'black',
    //                   fontWeight: 'bold',
    //                   cursor: 'pointer',
    //                 }}
    //               >
    //                 {column.render('Header')}
    //                 <span>
    //                   {column.isSorted
    //                     ? column.isSortedDesc
    //                       ? ' 🔻'
    //                       : ' 🔺'
    //                     : ''}
    //                 </span>
    //               </th>
    //             ))}
    //           </tr>
    //         ))}
    //       </thead>
    //       <tbody {...getTableBodyProps()}>
    //         {data.map((x, i) => {
    //           return (
    //             <tr key={`expanded-${i}`}>
    //               {parentRow.cells.map((cell, ci) => {
    //                 return (
    //                   <td {...cell.getCellProps()} key={`body-${ci}`}>
    //                     {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
    //                       value:
    //                         cell.column.accessor && cell.column.accessor(x, i),
    //                       row: { ...parentRow, original: x },
    //                     })}
    //                   </td>
    //                 );
    //               })}
    //             </tr>
    //           );
    //         })}
    //       </tbody>

    //       <tbody {...getTableBodyProps()}>
    //         {rows.map((row, bodyIndex) => {
    //           prepareRow(row);
    //           return (
    //             <tr {...row.getRowProps()} key={`bodyrow-${bodyIndex}`}>
    //               {row.cells.map((cell, cellIndex) => {
    //                 return (
    //                   <td
    //                     {...cell.getCellProps()}
    //                     key={`bodycol-${cellIndex}`}
    //                     style={{
    //                       padding: '10px',
    //                       border: 'solid 1px gray',
    //                       background: 'papayawhip',
    //                     }}
    //                   >
    //                     {cell.render('Cell')}
    //                   </td>
    //                 );
    //               })}
    //             </tr>
    //           );
    //         })}
    //       </tbody>
    //     </table>
    //   </td>
    // </tr>
  );
};

InnerRow.propTypes = {
  parentRow: PropTypes.shape,
  parentRowProps: PropTypes.shape,
  parentVisibleColumns: PropTypes.shape,
  data: PropTypes.shape,
};

export default InnerRow;
