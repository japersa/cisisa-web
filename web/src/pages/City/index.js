import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";

const City = ({
  departments,
  reduxGetDepartments,
  cities,
  reduxGetCities,
  reduxPostCity,
  city,
  reduxGetCity,
  rowEdited,
  reduxDeleteCity,
  rowDeleted,
  reduxPatchCity,
  rowUpdated,
  reduxResetCityForm,
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
    reduxResetCityForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxGetDepartments({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxResetCityForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idCity}</span>;
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
      title: "Estado",
      render: (rowData) => {
        return <span>{rowData.department.description}</span>;
      },
    },
    {
      title: "Opciones",
      render: (rowData) => {
        return (
          <>
            {rowData.isActive ? (
              <>
                <Show when="feature:edit-city">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-city">
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
              <Show when="feature:enabled-city">
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
    reduxGetDepartments({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxGetCity({
      id: row.idCity,
    });
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeleteCity(row);
    }
  };

  useEffect(() => {
    if (rowEdited && departments && Object.keys(departments).length > 0) {
      setShow(true);
      setValue("code", rowEdited.code);
      setValue("description", rowEdited.description);
      setValue("idDepartment", rowEdited.idDepartment);
    }
  }, [rowEdited, departments]);

  const handleDelete = (row) => {
    reduxDeleteCity(row);
  };

  useEffect(() => {
    reduxGetCities({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetCities({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      reduxPatchCity({ ...data, id: rowEdited.idCity });
    } else {
      reduxPostCity(data);
    }
    reset();
    reduxResetCityForm();
    setShow(false);
  };

  useEffect(() => {
    if (city || rowUpdated || rowDeleted) {
      reduxGetCities({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetCityForm();
    }
  }, [city, rowUpdated, rowDeleted]);

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Ciudades</h1>
                <Show when="feature:create-city">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de ciudades</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Ciudades
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      cities && Object.keys(cities).length > 0
                        ? cities.items
                        : []
                    }
                    page={
                      cities && Object.keys(cities).length > 0
                        ? Number(cities.page)
                        : currentPage
                    }
                    pages={
                      cities && Object.keys(cities).length > 0
                        ? Number(cities.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetCities({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetCities({
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
              <Modal.Title>{rowEdited ? "Editar" : "Nuevo"} Ciudad</Modal.Title>
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
                <label htmlFor="idDepartment" className="form-label">
                  Estado
                </label>
                <select
                  {...register("idDepartment", { required: true })}
                  id="idDepartment"
                  className={`custom-select ${errors.idDepartment && "is-invalid"
                    }`}
                >
                  <option value={""}>Seleccionar…</option>
                  {departments &&
                    Object.keys(departments).length > 0 &&
                    departments.items.map((ele, key) => (
                      <option key={key} value={ele.idDepartment}>
                        {ele.description}
                      </option>
                    ))}
                </select>
                {errors.idDepartment && (
                  <span className="invalid-feedback">
                    El estado es requerido
                  </span>
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
    departments: state.departmentState.departments,
    cities: state.cityState.cities,
    city: state.cityState.city,
    rowEdited: state.cityState.rowEdited,
    rowDeleted: state.cityState.rowDeleted,
    rowUpdated: state.cityState.rowUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetDepartments: (payload) =>
      dispatch({
        type: "FETCH_DEPARTMENTS_REQUEST",
        value: payload,
      }),
    reduxGetCities: (payload) =>
      dispatch({
        type: "FETCH_CITIES_REQUEST",
        value: payload,
      }),
    reduxPostCity: (payload) =>
      dispatch({
        type: "CREATE_CITY_REQUEST",
        value: payload,
      }),
    reduxGetCity: (payload) =>
      dispatch({
        type: "READ_CITY_REQUEST",
        value: payload,
      }),
    reduxDeleteCity: (payload) =>
      dispatch({
        type: "DELETE_CITY_REQUEST",
        value: payload,
      }),
    reduxPatchCity: (payload) =>
      dispatch({
        type: "UPDATE_CITY_REQUEST",
        value: payload,
      }),
    reduxResetCityForm: () =>
      dispatch({
        type: "RESET_CITY_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(City);
