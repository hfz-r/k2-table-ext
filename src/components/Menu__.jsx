import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ToggleMenu = props => {
  const { column, allColumns, visibleColumns } = props;

  const toggleRef = useRef(null);
  const [isOpen, onOpen] = useState(false);

  const menuProps = {
    column,
    allColumns,
    visibleColumns,
  };

  return (
    <>
      <div
        ref={toggleRef}
        role="presentation"
        onClick={e => {
          e.stopPropagation();
          onOpen(!isOpen);
        }}
      >
        <svg width="14" height="12" viewBox="0 0 14 12">
          <g fillRule="evenodd">
            <rect width="14" height="2" rx="1" />
            <rect width="14" height="2" y="5" rx="1" />
            <rect width="14" height="2" y="10" rx="1" />
          </g>
        </svg>
      </div>
      <div {...menuProps} />
    </>
  );
};

ToggleMenu.propTypes = {
  column: PropTypes.shape,
  allColumns: PropTypes.arrayOf,
  visibleColumns: PropTypes.arrayOf,
};

export default ToggleMenu;
