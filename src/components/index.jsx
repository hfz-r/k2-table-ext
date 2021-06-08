/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPayload, transformPayload } from '../utils';
import Table from './Table';
import InnerRow from './InnerRow';

const initialResource = fetchPayload();

const Main = props => {
  const [resource, setResource] = useState(initialResource);

  // parent columns
  const columns = useMemo(() => [
    {
      id: 'expander',
      Header: () => null,
      Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? '➖' : '➕'}
        </span>
      ),
      SubCell: () => null,
    },
    {
      Header: 'Id',
      accessor: 'children[0].Id',
      Cell: () => null,
      SubCell: ({ row }) => row.values['children[0].Id'],
    },
    {
      Header: 'InvestorID',
      accessor: 'parent.InvestorID',
    },
    {
      Header: 'InvestorName',
      accessor: 'parent.InvestorName',
    },
    {
      Header: 'Currency',
      accessor: 'children[0].Currency',
    },
    {
      Header: 'SetupType',
      accessor: 'parent.SetupType',
    },
    {
      Header: 'SetupDate',
      accessor: 'parent.SetupDate',
    },
    {
      Header: 'SetupBy',
      accessor: 'parent.SetupBy',
    },
  ]);

  // transformed data
  const data = useMemo(
    () => transformPayload(resource.payload.read()).slice(0, 20),
    []
  );

  // subcomponent
  const renderSubComponent = useCallback(({ row }) => {
    // console.log(row);
    return <InnerRow parentRow={row} data={data} />;
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      renderSubComponent={renderSubComponent}
      {...props}
    />
  );
};

Main.propTypes = {
  row: PropTypes.shape,
};

export default Main;
