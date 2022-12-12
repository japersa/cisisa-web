import React, { useState } from "react";
import { Pagination } from "react-bootstrap";

const Grid = ({
  defaultValue,
  cols,
  data = [],
  page,
  pages,
  onChangeRange,
  onChangePage,
  onChangeSearch,
}) => {
  const [value, setValue] = useState(defaultValue);

  const onChangeValue = (event) => {
    setValue(event.target.value);
  };

  const ranges = [10, 25, 50, 100];

  const showPaginationNumbers = (pageNumbers) => {
    let paginationNumbers = [];
    if (pageNumbers) {
      let showMax = 3;
      let endPage;
      let startPage;
      if (pageNumbers <= showMax) {
        startPage = 1;
        endPage = pageNumbers.length;
      } else {
        startPage = page;
        if (
          startPage != pageNumbers.length &&
          startPage + 1 != pageNumbers.length
        ) {
          endPage = page + showMax - 1;
        } else {
          endPage = pageNumbers.length;
        }
      }
      for (let i = startPage; i <= endPage; i++) {
        paginationNumbers.push(i);
      }
      return showRenderPageNumbers(paginationNumbers);
    }
  };

  const showRenderPageNumbers = (paginationNumbers) => {
    if (paginationNumbers) {
      let result = paginationNumbers.map((number) => {
        return (
          <Pagination.Item
            key={number}
            active={number === page}
            onClick={() => onChangePage(number)}
          >
            {number}
          </Pagination.Item>
        );
      });
      return result;
    }
  };

  return (
    <div className="table-responsive">
      <div id="dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4">
        <div className="row mb-3">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="dataTable_length">
              <label>
                Mostrar{" "}
                <select
                  name="dataTable_length"
                  aria-controls="dataTable"
                  className="custom-select custom-select-sm form-control form-control-sm"
                  onChange={(event) => {
                    onChangeRange(event.target.value);
                  }}
                >
                  {ranges.map((elem, index) => (
                    <option key={index} value={elem}>
                      {elem}
                    </option>
                  ))}
                </select>{" "}
                registros
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div id="dataTable_filter" className="dataTables_filter">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control small"
                  placeholder="Buscar"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onChange={onChangeValue}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      onChangeSearch(value);
                    }}
                  >
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <table className={"table table-bordered dataTable"}>
          <thead>
            <tr>
              {cols.map((headerItem, index) => (
                <th key={index}>{headerItem.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {cols.map((col, key) => (
                    <td key={key}>{col.render(item)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="odd">
                <td
                  valign="top"
                  colSpan={cols.length}
                  className="dataTables_empty"
                >
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => onChangePage(1)} />
          <Pagination.Prev
            onClick={() => onChangePage(page !== 1 ? page - 1 : 1)}
          />
          {showPaginationNumbers(pages)}
          <Pagination.Next
            onClick={() => onChangePage(page !== pages ? page + 1 : pages)}
          />
          <Pagination.Last onClick={() => onChangePage(pages)} />
        </Pagination>
      </div>
    </div>
  );
};

export default Grid;
