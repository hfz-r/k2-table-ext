import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { isEqual, reduce } from "lodash";
import { fetchPayload, transformPayload } from "../utils";
import Table from "./Table";
import InnerTable from "./InnerTable";
import { NumberRangeColumnFilter, SelectColumnFilter } from "./Filters";

const initialResource = fetchPayload();

const Main = (props) => {
  const [resource, setResource] = useState(initialResource);
  // const [originalResource] = useState(resource);
  const skipReset = useRef(false);

  useEffect(() => {
    skipReset.current = false;
  }, [resource]);

  // parent columns
  const columns = useMemo(
    () => [
      {
        id: "expander",
        Header: () => null,
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "➖" : "➕"}
          </span>
        ),
        SubCell: () => null,
        Aggregated: () => null,
        collapse: true,
      },
      {
        Header: "InvestorID",
        accessor: "parent.InvestorID",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} investor ids`,
      },
      {
        Header: "InvestorName",
        accessor: "parent.InvestorName",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} investor names`,
        filter: "fuzzyText",
      },
      {
        Header: "SetupType",
        accessor: "parent.SetupType",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} types`,
        filter: "includes",
        Filter: SelectColumnFilter,
      },
      {
        Header: "SetupDate",
        accessor: "parent.SetupDate",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} setup date`,
        filter: "between",
        Filter: NumberRangeColumnFilter,
        collapse: true,
      },
      {
        Header: "SetupBy",
        accessor: "parent.SetupBy",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} setup-by`,
      },
    ],
    []
  );

  // transformed data
  const data = transformPayload(resource.payload.read());

  // update data
  const updateData = (rowIndex, columnId, value) => {
    skipReset.current = true;
    setResource((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  // reset data
  // const resetData = () => {
  //   skipReset.current = true;
  //   setResource(originalResource);
  // };

  // subcomponent
  const renderSubComponent = useCallback(
    ({ row, visibleColumns }) =>
      visibleColumns.find((column) => column.id === "expander") ? (
        <InnerTable
          parentRow={row}
          parentVisibleColumns={visibleColumns}
          data={reduce(
            data,
            (result, value, key) => {
              return isEqual(key, parseInt(row.id, 10))
                ? result.concat(value.children)
                : result;
            },
            []
          )}
        />
      ) : undefined,
    [data]
  );

  return (
    <div className="container">
      {/* <button type="button" onClick={resetData}>
          Reset Data
        </button> */}
      <Table
        columns={columns}
        data={data}
        updateData={updateData}
        skipReset={skipReset.current}
        renderSubComponent={renderSubComponent}
        {...props}
      />
    </div>
  );
};

Main.propTypes = {
  row: PropTypes.object,
};

export default Main;
