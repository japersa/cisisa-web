import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";

const Neighborhood = ({
  reduxGetCities,
  cities,
  reduxGetNeighborhoods,
  neighborhoods,
  reduxGetNeighborhood,
  neighborhood,
  reduxPostNeighborhood,
  rowEdited,
  reduxDeleteNeighborhood,
  rowDeleted,
  reduxPatchNeighborhood,
  rowUpdated,
  reduxResetNeighborhoodForm,
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
    reduxResetNeighborhoodForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxGetCities({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxResetNeighborhoodForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idNeighborhood}</span>;
      },
    },
    {
      title: "Descripción",
      render: (rowData) => {
        return <span>{rowData.description}</span>;
      },
    },
    {
      title: "Latitud",
      render: (rowData) => {
        return <span>{rowData.lat}</span>;
      },
    },
    {
      title: "Longitud",
      render: (rowData) => {
        return <span>{rowData.lan}</span>;
      },
    },
    {
      title: "Ciudad",
      render: (rowData) => {
        return <span>{rowData.city.description}</span>;
      },
    },
    {
      title: "Opciones",
      render: (rowData) => {
        return (
          <>
            {rowData.isActive ? (
              <>
                <Show when="feature:edit-neighborhood">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-neighborhood">
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
              <Show when="feature:enabled-neighborhood">
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
    reduxGetCities({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxGetNeighborhood({
      id: row.idNeighborhood,
    });
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeleteNeighborhood(row);
    }
  };

  useEffect(() => {
    if (rowEdited) {
      setShow(true);
      setValue("lan", rowEdited.lan);
      setValue("lat", rowEdited.lat);
      setValue("description", rowEdited.description);
      setValue("idCity", rowEdited.idCity);
    }
  }, [rowEdited]);

  const handleDelete = (row) => {
    reduxDeleteNeighborhood(row);
  };

  useEffect(() => {
    reduxGetNeighborhoods({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetNeighborhoods({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      reduxPatchNeighborhood({ ...data, id: rowEdited.idNeighborhood });
    } else {
      reduxPostNeighborhood(data);
    }
    reset();
    reduxResetNeighborhoodForm();
    setShow(false);
  };

  useEffect(() => {
    if (neighborhood || rowUpdated || rowDeleted) {
      reduxGetNeighborhoods({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetNeighborhoodForm();
    }
  }, [neighborhood, rowUpdated, rowDeleted]);

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Barrios</h1>
                <Show when="feature:create-neighborhood">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de barrios</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Barrios
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      neighborhoods && Object.keys(neighborhoods).length > 0
                        ? neighborhoods.items
                        : []
                    }
                    page={
                      neighborhoods && Object.keys(neighborhoods).length > 0
                        ? Number(neighborhoods.page)
                        : currentPage
                    }
                    pages={
                      neighborhoods && Object.keys(neighborhoods).length > 0
                        ? Number(neighborhoods.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetNeighborhoods({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetNeighborhoods({
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
              <Modal.Title>{rowEdited ? "Editar" : "Nuevo"} Barrio</Modal.Title>
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
              <div className="form-group">
                <label htmlFor="idCity" className="form-label">
                  Ciudad
                </label>
                <select
                  {...register("idCity", { required: true })}
                  id="idCity"
                  className={`custom-select ${errors.idCity && "is-invalid"}`}
                >
                  <option value={""}>Seleccionar…</option>
                  {cities &&
                    Object.keys(cities).length > 0 &&
                    cities.items.map((ele, key) => (
                      <option key={key} value={ele.idCity}>
                        {ele.description}
                      </option>
                    ))}
                </select>
                {errors.idCity && (
                  <span className="invalid-feedback">
                    El ciudad es requerida
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
    cities: state.cityState.cities,
    neighborhoods: state.neighborhoodState.neighborhoods,
    neighborhood: state.neighborhoodState.neighborhood,
    rowEdited: state.neighborhoodState.rowEdited,
    rowDeleted: state.neighborhoodState.rowDeleted,
    rowUpdated: state.neighborhoodState.rowUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetCities: (payload) =>
      dispatch({
        type: "FETCH_CITIES_REQUEST",
        value: payload,
      }),
    reduxGetNeighborhoods: (payload) =>
      dispatch({
        type: "FETCH_NEIGHBORHOODS_REQUEST",
        value: payload,
      }),
    reduxPostNeighborhood: (payload) =>
      dispatch({
        type: "CREATE_NEIGHBORHOOD_REQUEST",
        value: payload,
      }),
    reduxGetNeighborhood: (payload) =>
      dispatch({
        type: "READ_NEIGHBORHOOD_REQUEST",
        value: payload,
      }),
    reduxDeleteNeighborhood: (payload) =>
      dispatch({
        type: "DELETE_NEIGHBORHOOD_REQUEST",
        value: payload,
      }),
    reduxPatchNeighborhood: (payload) =>
      dispatch({
        type: "UPDATE_NEIGHBORHOOD_REQUEST",
        value: payload,
      }),
    reduxResetNeighborhoodForm: () =>
      dispatch({
        type: "RESET_NEIGHBORHOOD_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Neighborhood);
