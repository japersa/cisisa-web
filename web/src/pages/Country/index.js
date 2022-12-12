import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";

const Country = ({
  countries,
  reduxGetCountries,
  reduxPostCountry,
  country,
  reduxGetCountry,
  rowEdited,
  reduxDeleteCountry,
  rowDeleted,
  reduxPatchCountry,
  rowUpdated,
  reduxResetCountryForm,
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
    reduxResetCountryForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxResetCountryForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idCountry}</span>;
      },
    },
    {
      title: "Descripción",
      render: (rowData) => {
        return <span>{rowData.description}</span>;
      },
    },
    {
      title: "Opciones",
      render: (rowData) => {
        return (
          <>
            {rowData.isActive ? (
              <>
                <Show when="feature:edit-country">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-country">
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
              <Show when="feature:enabled-country">
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
    reduxGetCountry({
      id: row.idCountry,
    });
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeleteCountry(row);
    }
  };

  useEffect(() => {
    if (rowEdited) {
      setShow(true);
      setValue("description", rowEdited.description);
    }
  }, [rowEdited]);

  const handleDelete = (row) => {
    reduxDeleteCountry(row);
  };

  useEffect(() => {
    reduxGetCountries({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetCountries({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      reduxPatchCountry({ ...data, id: rowEdited.idCountry });
    } else {
      reduxPostCountry(data);
    }
    reset();
    reduxResetCountryForm();
    setShow(false);
  };

  useEffect(() => {
    if (country || rowUpdated || rowDeleted) {
      reduxGetCountries({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetCountryForm();
    }
  }, [country, rowUpdated, rowDeleted]);

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Paises</h1>
                <Show when="feature:create-country">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de paises</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Paises
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      countries && Object.keys(countries).length > 0
                        ? countries.items
                        : []
                    }
                    page={
                      countries && Object.keys(countries).length > 0
                        ? Number(countries.page)
                        : currentPage
                    }
                    pages={
                      countries && Object.keys(countries).length > 0
                        ? Number(countries.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetCountries({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetCountries({
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
              <Modal.Title>{rowEdited ? "Editar" : "Nuevo"} Pais</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
    country: state.countryState.country,
    rowEdited: state.countryState.rowEdited,
    rowDeleted: state.countryState.rowDeleted,
    rowUpdated: state.countryState.rowUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetCountries: (payload) =>
      dispatch({
        type: "FETCH_COUNTRIES_REQUEST",
        value: payload,
      }),
    reduxPostCountry: (payload) =>
      dispatch({
        type: "CREATE_COUNTRY_REQUEST",
        value: payload,
      }),
    reduxGetCountry: (payload) =>
      dispatch({
        type: "READ_COUNTRY_REQUEST",
        value: payload,
      }),
    reduxDeleteCountry: (payload) =>
      dispatch({
        type: "DELETE_COUNTRY_REQUEST",
        value: payload,
      }),
    reduxPatchCountry: (payload) =>
      dispatch({
        type: "UPDATE_COUNTRY_REQUEST",
        value: payload,
      }),
    reduxResetCountryForm: () =>
      dispatch({
        type: "RESET_COUNTRY_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Country);
