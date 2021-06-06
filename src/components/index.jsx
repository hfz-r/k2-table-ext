/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPayload } from '../utils/fetch';
import Table from './Table';

const initialResource = fetchPayload();

const Main = ({ payload }) => {
  const [resource, setResource] = useState(initialResource);

  const data = useMemo(
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],
    []
  );

  return <Table columns={columns} data={data} resource={resource} />;
};

Main.propTypes = {
  payload: PropTypes.shape,
};

export default Main;
