/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import { containsNode, increaseLastColumnColSpan, join } from '../utils';

const ToggleMenu = props => {
  const { column, allColumns, visibleColumns, ...rest } = props;

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
      <Menu
        isOpen={isOpen}
        onClose={() => onOpen(false)}
        toggleRef={toggleRef}
        {...menuProps}
      />
    </>
  );
};

const initialItems = allColumns => [
  {
    label: 'Sort ascending',
    disabled: null,
  },
  {
    label: 'Sort descending',
    disabled: null,
  },
  {
    label: 'Unsort',
    disabled: true,
  },
  '-',
  {
    label: 'Group',
    disabled: null,
    onClick: (props, index) => console.log(props, index),
  },
  {
    label: 'Ungroup',
    disabled: null,
  },
  '-',
  {
    label: 'Show',
    disabled: null,
  },
  {
    label: 'Hide',
    disabled: null,
  },
  '-',
  {
    label: 'Columns',
    disabled: null,
    items: [
      allColumns.map(column => ({
        label: column.id,
        value: column.id,
        disabled: false,
        name: column.id,
        Input: <input type="checkbox" {...column.getToggleHiddenProps()} />,
      })),
    ],
  },
];

const getMenuClassName = props => {
  const className = join(
    props.rootClassName,
    props.subMenu && `${props.rootClassName}__submenu`,
    `${props.rootClassName}--depth-${props.depth}`,
    props.shadow && `${props.rootClassName}--shadow`
  );

  return className;
};

const Menu = props => {
  const { isOpen, onClose, toggleRef, column, allColumns } = props;

  const [items] = useState(() => initialItems(allColumns));

  const menuRef = useRef(null);
  const childRefs = useRef([]);

  const subRef = useRef(null);
  const toggleSubRef = useRef(null);

  const [menuState, setMenuState] = useState({
    activated: false,
    mouseInside: false,
  });
  const [subMenuIndex, setSubMenuIndex] = useState({
    active: null,
    nextActive: null,
    timestamp: new Date(),
  });

  const offsetRegion =
    toggleRef?.current && toggleRef?.current?.getBoundingClientRect();

  const handleClickOutside = event => {
    if (
      isOpen &&
      (!menuRef.current?.contains(event.target) ||
        toggleRef?.current?.contains(event.target))
    ) {
      onClose();
    }
  };

  const onActive = () => {
    if (!menuState.activated) {
      setMenuState(prevState => ({
        ...prevState,
        activated: true,
      }));
      if (props.onActivate) {
        props.onActivate();
      }
    }
  };

  const onInactivate = options => {
    if (menuState.activated) {
      setMenuState(prevState => ({
        ...prevState,
        activated: false,
      }));
      if (props.onInactivate) {
        props.onInactivate(options);
      }
    }
  };

  const handleMouseEnter = event => {
    setMenuState(prevState => ({
      ...prevState,
      mouseInside: true,
    }));
    onActive();
  };

  const handleMouseLeave = event => {
    setSubMenuIndex(prevState => ({
      ...prevState,
      nextActive: null,
      timestamp: +new Date(),
    }));

    setMenuState(prevState => ({
      ...prevState,
      mouseInside: false,
    }));

    if (!subMenuIndex.active && !subMenuIndex.nextActive) {
      onInactivate({
        hasFocus: global.document
          ? menuRef.current === global.document.activeElement
          : false,
        parentIndex: props.parentIndex,
      });
    }
  };

  const handleMouseMoveEvent = (index, hasSubMenu) => evt => {
    switch (evt.type) {
      case 'mouseover': {
        if (!hasSubMenu) {
          if (subMenuIndex.active != null) {
            setSubMenuIndex(prevState => ({
              ...prevState,
              nextActive: null,
            }));
          }
          break;
        }
        if (subMenuIndex.active == null) {
          setSubMenuIndex(prevState => ({
            ...prevState,
            active: index,
          }));
        } else {
          setSubMenuIndex(prevState => ({
            ...prevState,
            nextActive: index,
          }));
        }

        break;
      }

      case 'mouseout': {
        const elementAtMousePosition = document.elementFromPoint(
          evt.clientX,
          evt.clientY
        );
        if (
          elementAtMousePosition === subRef.current ||
          containsNode(subRef.current, elementAtMousePosition)
        ) {
          break;
        }
        if (subMenuIndex.active !== null) {
          setTimeout(() => {
            setSubMenuIndex(prevState => ({
              ...prevState,
              active: subMenuIndex.nextActive,
            }));
          }, 100);
        }

        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // render Table
  const Table = () => {
    const { rootClassName, visibleColumns, ...rest } = props;
    const className = `${rootClassName}__table`;

    const commonProps = () => ({
      rootClassName,
      onMouseOver: () => null,
      onMouseOut: () => null,
      onExpanderClick: event => {
        const { nativeEvent } = event;
        nativeEvent.expanderClick = true;
      },
      expander: rest.expander,
      expandedIndex: subMenuIndex.active,
    });

    const selectionProps = item => {
      const { name, value, Input } = item;

      let selection;
      if (name) {
        selection = {
          name,
          value,
          Input,
          checked: visibleColumns[name] === value,
        };
      }
      return selection;
    };

    const checkSiblingSubMenu = () =>
      items && !!items.filter(i => i.items && i.items.length).length;

    const MenuSeparator = () => (
      <tr className={`${rootClassName}__menu-separator`}>
        <td colSpan="100">
          <div className={`${rootClassName}__menu-separator__tool`}></div>
        </td>
      </tr>
    );

    return (
      <table className={className} cellSpacing={0} cellPadding={0}>
        <tbody>
          {items.map((item, index, allitems) => {
            if (item === '-') {
              return (
                <MenuSeparator key={index} rootClassName={rootClassName} />
              );
            }

            let { columns } = rest;

            const hasSubMenu =
              (item.items && !!item.items.length) ||
              (item.children && !!item.children.length);
            const expanded = commonProps().expandedIndex === index;

            if (!hasSubMenu && checkSiblingSubMenu()) {
              columns = increaseLastColumnColSpan(columns);
            }

            const itemProps = {
              index,
              item,
              allitems,
              hasSubMenu,
              expanded,
              columns,
              key: index,
              disabled: item.disabled,
              ref: element => {
                childRefs.current[index] = element;
              },
              ...commonProps(),
              ...selectionProps(item),
              ...item.props,
            };

            return <MenuItem key={index} {...itemProps} />;
          })}
        </tbody>
      </table>
    );
  };

  // render SubMenu
  const SubMenu = () => {
    const subMenuProps = {};
  };

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          tabIndex={0}
          className={getMenuClassName(props)}
          style={{
            zIndex: 110000,
            position: 'absolute',
            transform: `translate3d(${Math.floor(
              offsetRegion.left
            )}px, ${Math.floor(offsetRegion.top + 20)}px, 0px)`,
            top: 0,
            left: 0,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {subMenuIndex.active !== null && <div />}
          <Table {...props} />
        </div>
      )}
      {/* {isOpen && (
        <div
          ref={ref}
          style={{
            transform: `translate3d(${Math.floor(
              offsetRegion.left
            )}px, ${Math.floor(offsetRegion.top + 20)}px, 0px)`,
            top: 0,
            left: 0,
            boxShadow: '0 0 4px 0 rgb(0 0 0 / 40%)',
            color: '#9ba7b4',
            fill: '#9ba7b4',
            backgroundColor: '#313943',
            fontSize: '14px',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            transition: 'top 350ms ease-out',
          }}
          onMouseEnter={() => setMouseInside(true)}
          onMouseLeave={() => {
            setSubMenuIndex({
              ...subMenuIndex,
              nextActive: null,
            });
            setMouseInside(false);
          }}
        >
          <table
            cellSpacing="0"
            cellPadding="0"
            style={{
              width: '100%',
              textAlign: 'start',
              borderSpacing: '0',
              borderCollapse: 'separate',
            }}
          >
            <tbody>
              {entries.map(
                ({ content, mouseOver, hasSubMenu, ...other }, index) =>
                  content !== 'Separator' ? (
                    <tr
                      key={index}
                      style={{
                        userSelect: 'none',
                        color: mouseOver ? '#c5cae9' : '#9ba7b4',
                        fill: mouseOver ? '#c5cae9' : '#9ba7b4',
                        backgroundColor: mouseOver
                          ? 'rgba(121, 134, 203, 0.15)'
                          : '#313943',
                      }}
                      onMouseEnter={handleMouseEvent(index, true)}
                      onMouseLeave={handleMouseEvent(index, false)}
                      onMouseOver={handleMouseMoveEvent(index, hasSubMenu)}
                      onMouseOut={handleMouseMoveEvent(index, hasSubMenu)}
                      {...other}
                    >
                      <td
                        colSpan={hasSubMenu ? 0 : 2}
                        style={{
                          padding: '0 12px',
                          height: '32px',
                          verticalAlign: 'middle',
                          border: hasSubMenu && 0,
                        }}
                      >
                        {content}
                      </td>
                      {hasSubMenu && (
                        <>
                          <td
                            ref={toggleSubRef}
                            role="presentation"
                            size="10"
                            style={{
                              paddingRight: 0,
                              textAlign: 'end',
                              fill: '#737f8b',
                            }}
                          >
                            <div
                              style={{
                                borderRadius: '1px',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                paddingRight: '14px',
                              }}
                            >
                              <svg height="10" width="5" viewBox="0 0 5 10">
                                <path
                                  fillRule="evenodd"
                                  d="M4.738 5.262L.632 9.368c-.144.144-.379.144-.524 0C.04 9.298 0 9.204 0 9.106V.894C0 .69.166.524.37.524c.099 0 .193.039.262.108l4.106 4.106c.145.145.145.38 0 .524z"
                                ></path>
                              </svg>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ) : (
                    <tr key={index} style={{ height: '1px' }}>
                      <td colSpan="100" style={{ padding: '8px 0' }}>
                        <div
                          style={{
                            backgroundColor: '#4f575f',
                            height: '1px',
                          }}
                        ></div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      )} */}
      {/* {isOpen && subMenu && (
        <SubMenu subRef={subRef} subMenuFlag={renderSubMenuFlag} />
      )} */}
    </>
  );
};

Menu.defaultProps = {
  rootClassName: 'k2-table-ext-menu',
  depth: 0,
  shadow: true,
  columns: ['label'],
};

ToggleMenu.propTypes = {
  column: PropTypes.shape,
  allColumns: PropTypes.arrayOf,
  visibleColumns: PropTypes.arrayOf,
};

Menu.propTypes = {
  rootClassName: PropTypes.string,
  depth: PropTypes.number,
  shadow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  toggleRef: PropTypes.node,
  parentIndex: PropTypes.number,
  column: PropTypes.shape,
  columns: PropTypes.arrayOf,
  allColumns: PropTypes.arrayOf,
  visibleColumns: PropTypes.arrayOf,
};

export default ToggleMenu;
