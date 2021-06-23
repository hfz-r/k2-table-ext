/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { matchSorter } from 'match-sorter';

const fuzzyTextFilterFn = (rows, id, filterValue) =>
  matchSorter(rows, filterValue, { keys: [row => row.values[id]] });

fuzzyTextFilterFn.autoRemove = val => !val;

const SettingIcon = () => (
  <div className="header-filter-settings">
    <svg
      tabIndex="0"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="header-filter-settings-icon"
    >
      <path
        fillRule="evenodd"
        d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
      ></path>
    </svg>
  </div>
);

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <>
      <div className="header-filter filter-text-input">
        <input
          className="text-input__input"
          value={filterValue || ''}
          onChange={e => setFilter(e.target.value || undefined)}
          placeholder={`Search ${count} records`}
        />
      </div>
      <SettingIcon />
    </>
  );
};

const NumberRangeColumnFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <div className="header-filter filter-text-input">
        <input
          className="text-input__input"
          value={filterValue[0] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <input
          className="text-input__input"
          value={filterValue[1] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
      <SettingIcon />
    </>
  );
};

const SelectColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach(row => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <>
      <div className="header-filter filter-text-input">
        <select
          className="text-input__input"
          value={filterValue}
          onChange={e => {
            setFilter(e.target.value || undefined);
          }}
        >
          <option value="">All</option>
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <SettingIcon />
    </>
  );
};

DefaultColumnFilter.propTypes = {
  column: PropTypes.shape,
};

NumberRangeColumnFilter.propTypes = {
  column: PropTypes.shape,
};

SelectColumnFilter.propTypes = {
  column: PropTypes.shape,
};

export {
  fuzzyTextFilterFn,
  DefaultColumnFilter,
  NumberRangeColumnFilter,
  SelectColumnFilter,
};
