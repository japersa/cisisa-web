import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";

const Department = ({
  countries,
  reduxGetCountries,
  departments,
  reduxGetDepartments,
  reduxPostDepartment,
  department,
  reduxGetDepartment,
  rowEdited,
  reduxDeleteDepartment,
  rowDeleted,
  reduxPatchDepartment,
  rowUpdated,
  reduxResetDepartmentForm,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(10);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    reduxResetDepartmentForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxGetCountries({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxResetDepartmentForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idDepartment}</span>;
      },
    },
    {
      title: "Código",
      render: (rowData) => {
        return <span>{rowData.code}</span>;
      },
    },
    {
      title: "Descripción",
      render: (rowData) => {
        return <span>{rowData.description}</span>;
      },
    },
    {
      title: "Pais",
      render: (rowData) => {
        return <span>{rowData.country.description}</span>;
      },
    },
    {
      title: "Opciones",
      render: (rowData) => {
        return (
          <>
            {rowData.isActive ? (
              <>
                <Show when="feature:edit-department">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-department">
                  <button
                    title="Desactivar"
                    className="btn btn-danger btn-sm btn-circle"
                    type="button"
                    onClick={(e) => handleDelete(rowData)}
                  >
                    <i className="fas fa-times-circle fa-xs"></i>
                  </button>
                </Show>
              </>
            ) : (
              <Show when="feature:enabled-department">
                <button
                  title="Activar"
                  className="btn btn-primary btn-sm  btn-circle mr-2"
                  type="button"
                  onClick={(e) => handleActive(rowData)}
                >
                  <i className="fas fa-check-circle fa-xs"></i>
                </button>
              </Show>
            )}
          </>
        );
      },
    },
  ];

  const handleOpen = (row) => {
    reduxGetCountries({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxGetDepartment({
      id: row.idDepartment,
    });
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeleteDepartment(row);
    }
  };

  useEffect(() => {
    if (rowEdited && countries && Object.keys(countries).length > 0) {
      setShow(true);
      setValue("code", rowEdited.code);
      setValue("description", rowEdited.description);
      setValue("idCountry", rowEdited.idCountry);
    }
  }, [rowEdited, countries]);

  const handleDelete = (row) => {
    reduxDeleteDepartment(row);
  };

  useEffect(() => {
    reduxGetDepartments({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetDepartments({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      reduxPatchDepartment({ ...data, id: rowEdited.idDepartment });
    } else {
      reduxPostDepartment(data);
    }
    reset();
    reduxResetDepartmentForm();
    setShow(false);
  };

  useEffect(() => {
    if (department || rowUpdated || rowDeleted) {
      reduxGetDepartments({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetDepartmentForm();
    }
  }, [department, rowUpdated, rowDeleted]);

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Estados</h1>
                <Show when="feature:create-department">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de estados</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Estados
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      departments && Object.keys(departments).length > 0
                        ? departments.items
                        : []
                    }
                    page={
                      departments && Object.keys(departments).length > 0
                        ? Number(departments.page)
                        : currentPage
                    }
                    pages={
                      departments && Object.keys(departments).length > 0
                        ? Number(departments.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetDepartments({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetDepartments({
                        page: 1,
                        offset: offset,
                        search: value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {rowEdited ? "Editar" : "Nuevo"} Estado
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="code" className="form-label">
                  Código
                </label>
                <input
                  id="code"
                  type="text"
                  className={`form-control form-control-user ${errors.code && "is-invalid"
                    }`}
                  {...register("code", { required: true })}
                />
                {errors.description && (
                  <span className="invalid-feedback">
                    La código es requerido
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <input
                  id="description"
                  type="text"
                  className={`form-control form-control-user ${errors.description && "is-invalid"
                    }`}
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <span className="invalid-feedback">
                    La descripción es requerida
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="idCountry" className="form-label">
                  Pais
                </label>
                <select
                  {...register("idCountry", { required: true })}
                  id="idCountry"
                  className={`custom-select ${errors.idCountry && "is-invalid"
                    }`}
                >
                  <option value={""}>Seleccionar…</option>
                  {countries &&
                    Object.keys(countries).length > 0 &&
                    countries.items.map((ele, key) => (
                      <option key={key} value={ele.idCountry}>
                        {ele.description}
                      </option>
                    ))}
                </select>
                {errors.idCountry && (
                  <span className="invalid-feedback">El pais es requerido</span>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    countries: state.countryState.countries,
    departments: state.departmentState.departments,
    department: state.departmentState.department,
    rowEdited: state.departmentState.rowEdited,
    rowDeleted: state.departmentState.rowDeleted,
    rowUpdated: state.departmentState.rowUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetCountries: (payload) =>
      dispatch({
        type: "FETCH_COUNTRIES_REQUEST",
        value: payload,
      }),
    reduxGetDepartments: (payload) =>
      dispatch({
        type: "FETCH_DEPARTMENTS_REQUEST",
        value: payload,
      }),
    reduxPostDepartment: (payload) =>
      dispatch({
        type: "CREATE_DEPARTMENT_REQUEST",
        value: payload,
      }),
    reduxGetDepartment: (payload) =>
      dispatch({
        type: "READ_DEPARTMENT_REQUEST",
        value: payload,
      }),
    reduxDeleteDepartment: (payload) =>
      dispatch({
        type: "DELETE_DEPARTMENT_REQUEST",
        value: payload,
      }),
    reduxPatchDepartment: (payload) =>
      dispatch({
        type: "UPDATE_DEPARTMENT_REQUEST",
        value: payload,
      }),
    reduxResetDepartmentForm: () =>
      dispatch({
        type: "RESET_DEPARTMENT_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Department);
