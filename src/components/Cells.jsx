/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { join } from '../utils';

const Cells = props => {
  const { cellProps, rootClassName, align, ...rest } = props;

  const children = rest.expander || rest.children;
  const className = join(
    rest.className,
    cellProps.className,
    `${rootClassName}__cell`
  );

  const style = {
    ...rest.style,
    ...cellProps.style,
  };

  if (align) {
    style.textAlign = align;
  }

  return (
    <td {...cellProps} style={style} className={className}>
      {children}
    </td>
  );
};

Cells.defaultProps = {
  cellProps: {},
};

Cells.propTypes = {
  rootClassName: PropTypes.string,
  column: PropTypes.shape,
  cellProps: PropTypes.shape,
  expander: PropTypes.node,
  align: PropTypes.oneOf(['start', 'end', 'center', 'left', 'right']),
};

export default Cells;
