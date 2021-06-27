import React, { forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Checkbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

Checkbox.propTypes = {
  indeterminate: PropTypes.number,
};

export default Checkbox;
