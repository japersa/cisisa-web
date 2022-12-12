import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";

const Permission = ({
  reduxGetPermissions,
  permissions,
  reduxPostPermission,
  permission,
  reduxGetPermission,
  rowEdited,
  reduxDeletePermission,
  rowDeleted,
  reduxPatchPermission,
  rowUpdated,
  reduxResetPermissionForm,
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
    reduxResetPermissionForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxResetPermissionForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idPermission}</span>;
      },
    },
    {
      title: "Nombre",
      render: (rowData) => {
        return <span>{rowData.name}</span>;
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
                <Show when="feature:edit-permission">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-permission">
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
              <Show when="feature:enabled-permission">
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
    reduxGetPermission({
      id: row.idPermission,
    });
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeletePermission(row);
    }
  };

  useEffect(() => {
    if (rowEdited) {
      setShow(true);
      setValue("description", rowEdited.description);
      setValue("name", rowEdited.name);
    }
  }, [rowEdited]);

  const handleDelete = (row) => {
    reduxDeletePermission(row);
  };

  useEffect(() => {
    reduxGetPermissions({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetPermissions({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      reduxPatchPermission({ ...data, id: rowEdited.idPermission });
    } else {
      reduxPostPermission(data);
    }
    reset();
    reduxResetPermissionForm();
    setShow(false);
  };

  useEffect(() => {
    if (permission || rowUpdated || rowDeleted) {
      reduxGetPermissions({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetPermissionForm();
    }
  }, [permission, rowUpdated, rowDeleted]);

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Permisos</h1>
                <Show when="feature:create-permission">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de permisos</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Permisos
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      permissions && Object.keys(permissions).length > 0
                        ? permissions.items
                        : []
                    }
                    page={
                      permissions && Object.keys(permissions).length > 0
                        ? Number(permissions.page)
                        : currentPage
                    }
                    pages={
                      permissions && Object.keys(permissions).length > 0
                        ? Number(permissions.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetPermissions({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetPermissions({
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
                {rowEdited ? "Editar" : "Nuevo"} Permission
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  className={`form-control form-control-user ${errors.name && "is-invalid"
                    }`}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <span className="invalid-feedback">
                    El nombre es requerido
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
    permissions: state.permissionState.permissions,
    permission: state.permissionState.permission,
    rowEdited: state.permissionState.rowEdited,
    rowDeleted: state.permissionState.rowDeleted,
    rowUpdated: state.permissionState.rowUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetPermissions: (payload) =>
      dispatch({
        type: "FETCH_PERMISSIONS_REQUEST",
        value: payload,
      }),
    reduxPostPermission: (payload) =>
      dispatch({
        type: "CREATE_PERMISSION_REQUEST",
        value: payload,
      }),
    reduxGetPermission: (payload) =>
      dispatch({
        type: "READ_PERMISSION_REQUEST",
        value: payload,
      }),
    reduxDeletePermission: (payload) =>
      dispatch({
        type: "DELETE_PERMISSION_REQUEST",
        value: payload,
      }),
    reduxPatchPermission: (payload) =>
      dispatch({
        type: "UPDATE_PERMISSION_REQUEST",
        value: payload,
      }),
    reduxResetPermissionForm: () =>
      dispatch({
        type: "RESET_PERMISSION_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
