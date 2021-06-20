/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
function increaseColSpan(column) {
  let newColumn = column;
  if (typeof newColumn === 'string') {
    newColumn = {
      name: newColumn,
      colSpan: 2,
    };
  } else {
    newColumn = {
      ...column,
      colSpan: newColumn.colSpan ? newColumn.colSpan + 1 : 2,
    };
  }
  return newColumn;
}

export function increaseLastColumnColSpan(columns) {
  return [
    ...columns.slice(0, -1),
    increaseColSpan(columns[columns.length - 1]),
  ];
}

export function containsNode(parent, child) {
  if (
    !parent ||
    !child ||
    !(parent instanceof Element) ||
    !(child instanceof Element)
  ) {
    return false;
  }

  // target node should still be in the tree
  if (!global.document.body.contains(child)) {
    return false;
  }

  let result = true;
  if (parent !== child && !parent.contains(child)) {
    result = false;
  }

  return result;
}

const notEmpty = x => !!x && x !== true;
export function join(...args) {
  if (args.length === 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  return [...args].filter(notEmpty).join(' ');
}
