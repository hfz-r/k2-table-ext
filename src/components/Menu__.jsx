/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import {
  connectMenu,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
  SubMenu,
} from 'react-contextmenu';
import PropTypes from 'prop-types';
import IndeterminateCheckbox from './Checkbox';

const MENU_ID = 'k2-table-ext-menu';

export const MenuWrapper = ({ column }) => {
  const toggleRef = useRef(null);
  const attributes = {
    'data-tooltip': 'Right/left click to see the menu',
    className: 'k2-table-ext-menu-group',
  };

  const toggleMenu = e => {
    if (toggleRef) {
      e.stopPropagation();
      toggleRef.current.handleContextClick(e);
    }
  };

  const handleClick = (e, data, target) => {
    target.setAttribute('data-tooltip', `${data.item} on column ${data.name}`);
  };

  return (
    <>
      <ContextMenuTrigger
        id={MENU_ID}
        ref={toggleRef}
        name={column.Header}
        attributes={attributes}
        column={column}
        collect={props => props}
        onMenuClick={handleClick}
      >
        <div role="presentation" onClick={toggleMenu}>
          <svg
            enableBackground="new 0 0 515.555 515.555"
            width="14"
            height="14"
            viewBox="0 0 515.555 515.555"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
            <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
            <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
          </svg>
        </div>
      </ContextMenuTrigger>
    </>
  );
};

MenuWrapper.propTypes = {
  column: PropTypes.shape,
};

const Menu = props => {
  const { id, columns, toggleAll, trigger } = props;
  const column = trigger ? trigger.column : null;
  const handleClick = trigger ? trigger.onMenuClick : null;

  return (
    <ContextMenu id={id}>
      {column && column.canGroupBy ? (
        <span {...column.getGroupByToggleProps()}>
          <MenuItem
            data={{ item: column.isGrouped ? 'Ungroup' : 'Group' }}
            onClick={handleClick}
          >
            {column.isGrouped ? 'Ungroup' : 'Group'}
          </MenuItem>
        </span>
      ) : null}
      {trigger && <MenuItem divider />}
      {trigger && (
        <SubMenu title="Columns" preventCloseOnClick>
          <MenuItem preventClose>
            <IndeterminateCheckbox {...toggleAll()} /> Toggle All
          </MenuItem>
          {columns.map(
            (col, idx) =>
              col.id !== 'expander' && (
                <MenuItem key={`item-${idx}`} preventClose>
                  <label htmlFor="checkbox">
                    <input type="checkbox" {...col.getToggleHiddenProps()} />{' '}
                    {col.Header}
                  </label>
                </MenuItem>
              )
          )}
        </SubMenu>
      )}
    </ContextMenu>
  );
};

Menu.propTypes = {
  id: PropTypes.string.isRequired,
  trigger: PropTypes.shape({
    name: PropTypes.string.isRequired,
    column: PropTypes.shape.isRequired,
    onMenuClick: PropTypes.func.isRequired,
  }).isRequired,
  columns: PropTypes.arrayOf,
  toggleAll: PropTypes.func,
};

export const ConnectedMenu = connectMenu(MENU_ID)(Menu);
