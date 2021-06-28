import React from "react";
import PropTypes from "prop-types";

const Pagination = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
}) => (
  <div className="toolbar">
    <div className="pagination toolbar-wrapper">
      <button
        className="toolbar-button paging-first"
        type="button"
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
      >
        {"⏪"}
      </button>{" "}
      <button
        className="toolbar-button paging-left"
        type="button"
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      >
        {"◀️"}
      </button>{" "}
      <button
        className="toolbar-button paging-right"
        type="button"
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        {"▶️"}
      </button>{" "}
      <button
      className="toolbar-button paging-last"
        type="button"
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      >
        {"⏩"}
      </button>{" "}
      <span>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{" "}
      </span>
      <span>
        | Go to page:{" "}
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{ width: "100px" }}
        />
      </span>{" "}
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  </div>
);

Pagination.propTypes = {
  gotoPage: PropTypes.func,
  previousPage: PropTypes.func,
  nextPage: PropTypes.func,
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.array,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
};

export default Pagination;
