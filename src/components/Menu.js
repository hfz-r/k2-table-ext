import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  connectMenu,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
  SubMenu,
} from "react-contextmenu";
import PropTypes from "prop-types";
import IndeterminateCheckbox from "./Checkbox";

const MENU_ID = "k2-table-ext-menu";

export const MenuWrapper = ({ column }) => {
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const attributes = {
    "data-tooltip": "Right/left click to see the menu",
    className: "k2-table-ext-menu-group--disabled",
  };

  const toggleMenu = (e) => {
    setVisible(true);
    if (toggleRef) {
      e.stopPropagation();
      toggleRef.current.handleContextClick(e);
    }
  };

  const handleClick = (e, data, target) => {
    target.setAttribute("data-tooltip", `${data.item} on column ${data.name}`);
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (visible && !menuRef?.current?.contains(event.target)) {
        setVisible(false);
      }
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <ContextMenuTrigger
        id={MENU_ID}
        ref={toggleRef}
        name={column.Header}
        attributes={attributes}
        column={column}
        collect={(props) => props}
        onMenuClick={handleClick}
      >
        <div
          ref={menuRef}
          role="presentation"
          className={`header-menu header-menu--hover ${
            visible ? "header-menu--visible" : ""
          }`}
          onClick={toggleMenu}
        >
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            className="sort-icon-desc"
          >
            <g fillRule="evenodd">
              <rect width="14" height="2" rx="1" />
              <rect width="14" height="2" y="5" rx="1" />
              <rect width="14" height="2" y="10" rx="1" />
            </g>
          </svg>
        </div>
      </ContextMenuTrigger>
    </>
  );
};

MenuWrapper.propTypes = {
  column: PropTypes.object,
};

const Menu = (props) => {
  const { id, columns, toggleAll, trigger } = props;
  const column = trigger ? trigger.column : null;
  const handleClick = trigger ? trigger.onMenuClick : null;

  return (
    <ContextMenu id={id}>
      {column && column.canGroupBy ? (
        <span {...column.getGroupByToggleProps()}>
          <MenuItem
            data={{ item: column.isGrouped ? "Ungroup" : "Group" }}
            onClick={handleClick}
          >
            {column.isGrouped ? "Ungroup" : "Group"}
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
              col.id !== "expander" && (
                <MenuItem key={`item-${idx}`} preventClose>
                  <label htmlFor="checkbox">
                    <input type="checkbox" {...col.getToggleHiddenProps()} />{" "}
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
  }),
  columns: PropTypes.array,
  toggleAll: PropTypes.func,
};

export const ConnectedMenu = connectMenu(MENU_ID)(Menu);
