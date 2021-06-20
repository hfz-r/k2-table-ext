/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ToggleMenu = ({ column }) => {
  const toggleRef = useRef(null);
  const [isOpen, onOpen] = useState(false);

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
        column={column}
      />
    </>
  );
};

const containsNode = (parent, child) => {
  if (
    !parent ||
    !child ||
    !(parent instanceof Element) ||
    !(child instanceof Element)
  ) {
    return false;
  }
  if (!document.body.contains(child)) {
    return false;
  }

  let result = true;
  if (parent !== child && !parent.contains(child)) {
    result = false;
  }

  return result;
};

const initialEntries = [
  {
    content: 'Group',
    mouseOver: false,
    hasSubMenu: false,
    onClick: () => console.log('This if GROUP'),
  },
  {
    content: 'Ungroup',
    mouseOver: false,
    hasSubMenu: false,
  },
  {
    content: 'Separator',
    mouseOver: false,
    hasSubMenu: false,
  },
  {
    content: 'Show',
    mouseOver: false,
    hasSubMenu: false,
  },
  {
    content: 'Hide',
    mouseOver: false,
    hasSubMenu: false,
  },
  {
    content: 'Separator',
    mouseOver: false,
    hasSubMenu: false,
  },
  {
    content: 'Columns',
    mouseOver: false,
    hasSubMenu: true,
  },
];

const Menu = ({ isOpen, onClose, toggleRef, column, children }) => {
  const ref = useRef(null);
  const subRef = useRef(null);
  const toggleSubRef = useRef(null);
  const [isMouseInside, setMouseInside] = useState(false);
  const [subMenuIndex, setSubMenuIndex] = useState({
    active: null,
    nextActive: null,
  });
  const [entries, setEntry] = useState(initialEntries);

  const offsetRegion =
    toggleRef?.current && toggleRef?.current?.getBoundingClientRect();

  const handleClickOutside = event => {
    if (
      isOpen &&
      (!ref.current?.contains(event.target) ||
        toggleRef?.current?.contains(event.target))
    ) {
      onClose();
    }
  };

  const handleMouseEvent = (index, val) => evt => {
    setEntry(prevState =>
      prevState.map((entry, i) =>
        i === index
          ? {
              ...entry,
              mouseOver: val,
            }
          : entry
      )
    );
  };

  const handleMouseMoveEvent = (index, hasSubMenu) => evt => {
    switch (evt.type) {
      case 'mouseover': {
        if (!hasSubMenu) {
          if (subMenuIndex.active != null) {
            setSubMenuIndex({
              ...subMenuIndex,
              nextActive: null,
            });
          }
          break;
        }
        if (subMenuIndex.active == null) {
          setSubMenuIndex({
            ...subMenuIndex,
            active: index,
          });
        } else {
          setSubMenuIndex({
            ...subMenuIndex,
            nextActive: index,
          });
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
            setSubMenuIndex({
              ...subMenuIndex,
              active: subMenuIndex.nextActive,
            });
          }, 100);
        }

        break;
      }

      default:
        break;
    }
  };

  //   const renderSubMenuFlag = useCallback(newValue => {
  //     setSubFlag({
  //       ...subFlag,
  //       ...newValue,
  //     });
  //   }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {subMenuIndex.active !== null && (
        <div ref={subRef}>
          <Menu
            key={subMenuIndex.active}
            isOpen={isOpen}
            onClose={onClose}
            toggleRef={toggleSubRef}
          />
        </div>
      )}
      {isOpen && (
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
                ({ content, mouseOver, hasSubMenu, ...rest }, index) =>
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
                      {...rest}
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
      )}
      {/* {isOpen && subMenu && (
        <SubMenu subRef={subRef} subMenuFlag={renderSubMenuFlag} />
      )} */}
    </>
  );
};

const initialSubEntries = ['Column1', 'Column2', 'Column3'];

const SubMenu = ({ subRef, subMenuFlag }) => {
  const [subEntries, setSubEntry] = useState(initialSubEntries);

  const offsetRegion = subRef.current && subRef.current.getBoundingClientRect();

  const handleSubMouseOver = (index, val) => {
    subMenuFlag({ first: false, flag: val });
    setSubEntry([...subEntries]);
  };

  useEffect(() => {
    subMenuFlag({ first: true, flag: false });
  }, []);

  return (
    <div
      style={{
        transform: `translate3d(${Math.floor(
          offsetRegion.left + 40
        )}px, ${Math.floor(offsetRegion.top)}px, 0px)`,
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
          {subEntries.map((subentry, index) => (
            <tr
              key={index}
              style={{
                userSelect: 'none',
                color: '#9ba7b4',
                fill: '#9ba7b4',
                backgroundColor: '#313943',
              }}
              onMouseEnter={() => handleSubMouseOver(index, true)}
              onMouseLeave={() => handleSubMouseOver(index, false)}
            >
              <td
                colSpan={2}
                style={{
                  padding: '0 12px',
                  height: '32px',
                  width: '100px',
                  verticalAlign: 'middle',
                }}
              >
                {subentry}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ToggleMenu.propTypes = {
  column: PropTypes.shape,
};

Menu.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  toggleRef: PropTypes.node,
  column: PropTypes.shape,
  children: PropTypes.node,
};

SubMenu.propTypes = {
  subRef: PropTypes.node,
  subMenuFlag: PropTypes.func,
};

export default ToggleMenu;
