/* eslint-disable no-unused-vars */
import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Cells from './Cells';
import { join } from '../utils';

const getClassName = (props, state) => {
  const baseClassName = `${props.rootClassName}__row`;

  let className = join(
    props.item.className,
    baseClassName,
    state.mouseOver && `${baseClassName}--over`,
    state.active && `${baseClassName}--active`,
    props.expanded && `${baseClassName}--expanded`,
    props.item.isTitle && `${baseClassName}--title`,
    props.checked && `${baseClassName}--checked`
  );

  if (props.disabled) {
    className = join(
      baseClassName,
      props.disabled && `${baseClassName}--disabled`
    );
  }

  return className;
};

const Expander = ({ className, rootClassName, size = 20, onClick, fill }) => {
  return (
    <div className={`${rootClassName}__expander-wrapper`}>
      <div className={`${rootClassName}__expander-icon`}>
        <svg
          className={join(className, `${rootClassName}__expander`)}
          onClick={onClick}
          fill={fill}
          height={size}
          width={size / 2}
          viewBox="0 0 5 10"
        >
          <path
            fillRule="evenodd"
            d="M4.738 5.262L.632 9.368c-.144.144-.379.144-.524 0C.04 9.298 0 9.204 0 9.106V.894C0 .69.166.524.37.524c.099 0 .193.039.262.108l4.106 4.106c.145.145.145.38 0 .524z"
          />
        </svg>
      </div>
    </div>
  );
};

const MenuItem = forwardRef((props, ref) => {
  const [mounted, setMount] = useState(false);
  const [state, setState] = useState({
    active: false,
    mouseOver: false,
  });

  useEffect(() => {
    setMount(true);
    return () => {
      setMount(false);
    };
  }, []);

  const handleClick = event => {
    if (props.disabled && event.stopPropagation) {
      event.stopPropagation();
    }
    if (props.item.onClick) {
      props.item.onClick(event, props, props.index);
    }
  };

  const handleMouseEnter = event => {
    if (props.disabled) return;

    setState({
      ...state,
      mouseOver: true,
    });

    if (props.onMouseOver) {
      props.onMouseOver({
        event,
        itemProps: props,
        index: props.index,
        hasSubMenu: props.hasSubMenu,
      });
    }
  };

  const handleMouseLeave = event => {
    if (props.disabled) return;

    if (mounted) {
      setState({
        ...state,
        active: false,
        mouseOver: false,
      });
    }

    if (props.onMouseOut) {
      props.onMouseOut({
        event,
        itemProps: props,
        index: props.index,
        hasSubMenu: props.hasSubMenu,
        leaveOffset: {
          x: event.clientX,
          y: event.clientY,
        },
      });
    }
  };

  const handleMouseDown = () => {
    const mouseUpListener = () => {
      if (mounted) {
        setState({
          ...state,
          active: false,
        });
      }
      global.removeEventListener('mouseup', mouseUpListener);
    };

    global.addEventListener('mouseup', mouseUpListener);
    if (mounted) {
      setState({
        ...state,
        active: true,
      });
    }
  };

  const handleTouchStart = event => {
    const mouseUpListener = () => {
      if (mounted) {
        setState({
          ...state,
          active: false,
        });
      }
      global.removeEventListener('touchend', mouseUpListener);
    };

    global.addEventListener('touchend', mouseUpListener);
    if (mounted) {
      setState({
        ...state,
        active: true,
      });
    }

    if (!props.item.items) return;

    if (state.mouseOver) {
      handleMouseLeave(event);
    } else {
      handleMouseEnter(event);
    }
  };

  const renderCell = (column, index, columns) => {
    const item = props.allitems && props.allitems[index];
    const cellProps = { ...props.cellProps };

    const columnName = typeof column === 'string' ? column : column.name;
    const children = props.item[columnName];

    if (typeof column === 'object') {
      if (column.colSpan) {
        cellProps.colSpan = column.colSpan;
      }
    }

    return (
      <Cells
        key={index}
        style={column.style}
        className={column.className}
        rootClassName={props.rootClassName}
        cellProps={cellProps}
        align={column.align}
      >
        {children}
      </Cells>
    );
  };

  const renderInput = () => {
    const inputProps = {
      className: `${props.rootClassName}__cell__input`,
      name: props.name,
      disabled: props.disabled,
      checked: props.checked,
    };

    const cellProps = {
      key: 'select',
      rootClassName: props.rootClassName,
      className: `${props.rootClassName}__cell--has-input--checkbox`,
    };

    const { Input } = props;

    return (
      <Cells {...cellProps}>
        <Input {...inputProps} />
      </Cells>
    );
  };

  const renderExpander = () => {
    let { expander } = props;

    const expanderProps = {
      key: 'expander',
      rootClassName: props.rootClassName,
      className: `${props.rootClassName}__cell--has-expander`,
      onClick: props.onExpanderClick,
    };

    if (expander === undefined || expander === true) {
      expander = <Expander {...expanderProps} />;
    }

    return <Cells expander={expander} {...expanderProps} />;
  };

  const renderCells = () => {
    const cells = props.columns.map((...args) => renderCell(...args));

    if (props.name) {
      const input = renderInput();
      cells.unshift(input);
    }

    if (props.hasSubMenu) {
      const expander = renderExpander();
      cells.push(expander);
    }

    return cells;
  };

  const menuProps = {
    ...props,
    mouseOver: !!state.mouseOver,
    active: !!state.active,
    disabled: !!props.disabled,
    className: getClassName(props, state),
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
  };

  return (
    <>
      <tr ref={ref} {...menuProps}>
        {renderCells()}
      </tr>
    </>
  );
});

Expander.propTypes = {
  className: PropTypes.string,
  rootClassName: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
  fill: PropTypes.shape,
};

MenuItem.propTypes = {
  item: PropTypes.shape,
  allitems: PropTypes.shape,
  columns: PropTypes.shape,
  cellProps: PropTypes.shape,
  index: PropTypes.number,
  name: PropTypes.string,
  Input: PropTypes.node,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hasSubMenu: PropTypes.bool,
  expander: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
    PropTypes.func,
  ]),
  expanded: PropTypes.bool,
  checked: PropTypes.bool,
  rootClassName: PropTypes.string,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onSelectChange: PropTypes.func,
  onExpanderClick: PropTypes.func,
};

export default MenuItem;
