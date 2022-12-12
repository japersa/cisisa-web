import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";
import { useAuth } from "../../hooks/useAuth";
import { Multiselect } from "multiselect-react-dropdown";

const Role = ({
  reduxGetPermissions,
  permissions,
  roles,
  reduxGetRoles,
  reduxPostRole,
  role,
  reduxGetRole,
  rowEdited,
  reduxDeleteRole,
  rowDeleted,
  reduxPatchRole,
  rowUpdated,
  reduxResetRoleForm,
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
  const { session } = useAuth();
  const [show, setShow] = useState(false);
  const [itemsSelected, setItemsSelected] = useState([]);

  const handleClose = () => {
    reduxResetRoleForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxGetPermissions({
      page: 1,
      search: "",
      offset: 1000,
    });
    setItemsSelected([]);
    reduxResetRoleForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idRole}</span>;
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
                <Show when="feature:edit-role">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-role">
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
              <Show when="feature:enabled-role">
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
    reduxGetPermissions({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxGetRole({
      id: row.idRole,
    });
    setItemsSelected([]);
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeleteRole(row);
    }
  };

  useEffect(() => {
    if (rowEdited) {
      setShow(true);
      setValue("name", rowEdited.name);
      setValue("description", rowEdited.description);
      setValue("idCompany", rowEdited.idCompany);

      let valuesSelected = [];
      permissions.items.forEach((permission) => {
        rowEdited.permissions.forEach((perEdited) => {
          if (permission.idPermission == Number(perEdited)) {
            valuesSelected.push(permission);
          }
        });
      });
      setItemsSelected(valuesSelected);
    }
  }, [rowEdited]);

  const handleDelete = (row) => {
    reduxDeleteRole(row);
  };

  useEffect(() => {
    reduxGetRoles({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetRoles({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      reduxPatchRole({ ...data, id: rowEdited.idRole });
    } else {
      if (session && session.role.idCompany) {
        data.idCompany = session.role.idCompany;
      }
      reduxPostRole(data);
    }
    reset();
    reduxResetRoleForm();
    setShow(false);
  };

  useEffect(() => {
    if (role || rowUpdated || rowDeleted) {
      reduxGetRoles({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetRoleForm();
    }
  }, [role, rowUpdated, rowDeleted]);

  const multiselectRef = useRef({});
  multiselectRef.current = watch("multiselectRef", []);

  const onSelect = (selectedList, selectedItem) => {
    setValue("multiselectRef", selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setValue("multiselectRef", selectedList);
  };

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Roles</h1>
                <Show when="feature:create-role">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de roles</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Roles
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      roles && Object.keys(roles).length > 0 ? roles.items : []
                    }
                    page={
                      roles && Object.keys(roles).length > 0
                        ? Number(roles.page)
                        : currentPage
                    }
                    pages={
                      roles && Object.keys(roles).length > 0
                        ? Number(roles.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetRoles({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetRoles({
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
          size="xl"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title>{rowEdited ? "Editar" : "Nuevo"} Rol</Modal.Title>
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
              <div className="form-group">
                <label htmlFor="multiselectRef" className="form-label">
                  Permisos
                </label>
                {permissions && Object.keys(permissions).length > 0 && (
                  <Multiselect
                    options={permissions.items.map((permission, key) => {
                      return permission;
                    })}
                    {...register("multiselectRef")}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    displayValue="name"
                    showCheckbox={true}
                    hidePlaceholder={true}
                    selectedValues={itemsSelected}
                  />
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
    roles: state.roleState.roles,
    role: state.roleState.role,
    rowEdited: state.roleState.rowEdited,
    rowDeleted: state.roleState.rowDeleted,
    rowUpdated: state.roleState.rowUpdated,
    permissions: state.permissionState.permissions,
    permissionsRoles: state.permissionRoleState.permissionsRoles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetPermissions: (payload) =>
      dispatch({
        type: "FETCH_PERMISSIONS_REQUEST",
        value: payload,
      }),
    reduxGetPermissionsRoles: (payload) =>
      dispatch({
        type: "FETCH_PERMISSIONS_ROLES_REQUEST",
        value: payload,
      }),
    reduxGetRoles: (payload) =>
      dispatch({
        type: "FETCH_ROLES_REQUEST",
        value: payload,
      }),
    reduxPostRole: (payload) =>
      dispatch({
        type: "CREATE_ROLE_REQUEST",
        value: payload,
      }),
    reduxGetRole: (payload) =>
      dispatch({
        type: "READ_ROLE_REQUEST",
        value: payload,
      }),
    reduxDeleteRole: (payload) =>
      dispatch({
        type: "DELETE_ROLE_REQUEST",
        value: payload,
      }),
    reduxPatchRole: (payload) =>
      dispatch({
        type: "UPDATE_ROLE_REQUEST",
        value: payload,
      }),
    reduxResetRoleForm: () =>
      dispatch({
        type: "RESET_ROLE_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Role);
