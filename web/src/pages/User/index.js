import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Navigation/Sidebar";
import Topbar from "../../components/Navigation/Topbar";
import Grid from "../../components/Grid";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Show } from "../../hooks/Show";

const User = ({
  reduxGetRoles,
  roles,
  users,
  reduxGetUsers,
  reduxPostUser,
  user,
  reduxGetUser,
  rowEdited,
  reduxDeleteUser,
  rowDeleted,
  reduxPatchUser,
  rowUpdated,
  reduxResetUserForm,
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
  const [checked, setChecked] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reduxResetUserForm();
    setShow(false);
  };
  const handleShow = () => {
    reduxGetRoles({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxResetUserForm();
    reset();
    setShow(true);
  };
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "#",
      render: (rowData) => {
        return <span>{rowData.idUser}</span>;
      },
    },
    {
      title: "Primer Nombre",
      render: (rowData) => {
        return <span>{rowData.firstName}</span>;
      },
    },
    {
      title: "Segundo Nombre",
      render: (rowData) => {
        return <span>{rowData.secondName}</span>;
      },
    },
    {
      title: "Primer Apellido",
      render: (rowData) => {
        return <span>{rowData.lastName}</span>;
      },
    },
    {
      title: "Segundo Apellido",
      render: (rowData) => {
        return <span>{rowData.secondLastName}</span>;
      },
    },
    {
      title: "Documento",
      render: (rowData) => {
        return <span>{rowData.documentNumber}</span>;
      },
    },
    {
      title: "Email",
      render: (rowData) => {
        return <span>{rowData.email}</span>;
      },
    },
    {
      title: "Teléfono",
      render: (rowData) => {
        return <span>{rowData.phone}</span>;
      },
    },
    {
      title: "Rol",
      render: (rowData) => {
        return <span>{rowData.role.name}</span>;
      },
    },
    {
      title: "Opciones",
      render: (rowData) => {
        return (
          <>
            {rowData.isActive ? (
              <>
                <Show when="feature:edit-user">
                  <button
                    title="Editar"
                    className="btn btn-primary btn-sm  btn-circle mr-2"
                    type="button"
                    onClick={(e) => handleOpen(rowData)}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </button>
                </Show>
                <Show when="feature:disabled-user">
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
              <Show when="feature:enabled-user" >
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
    reduxGetRoles({
      page: 1,
      search: "",
      offset: 1000,
    });
    reduxGetUser({
      id: row.idUser,
    });
    reset();
  };

  const handleActive = (row) => {
    if (!row.isActive) {
      reduxDeleteUser(row);
    }
  };

  useEffect(() => {
    if (rowEdited) {
      setShow(true);
      setValue("firstName", rowEdited.firstName);
      setValue("secondName", rowEdited.secondName);
      setValue("lastName", rowEdited.lastName);
      setValue("secondLastName", rowEdited.secondLastName);
      setValue("documentNumber", rowEdited.documentNumber);
      setValue("email", rowEdited.email);
      setValue("phone", rowEdited.phone);
      setValue("idRole", rowEdited.idRole);
      setValue("userName", rowEdited.userName);
      setValue("isActive", rowEdited.isActive);
      // setValue("password", null);
      setValue("remember_token", rowEdited.remember_token);
    }
  }, [rowEdited]);

  const handleDelete = (row) => {
    reduxDeleteUser(row);
  };

  useEffect(() => {
    reduxGetUsers({
      page: 1,
      offset: offset,
      search: "",
    });
  }, []);

  useEffect(() => {
    reduxGetUsers({
      page: currentPage,
      offset: offset,
      search: search,
    });
  }, [currentPage]);

  const onSubmit = (data) => {
    if (rowEdited) {
      // const { ["password"]: remove, ...rest } = data;
      // if (data.password == null || data.password == "") {
      //   reduxPatchUser({ ...rest, id: rowEdited.idUser });
      // } else {
      //   reduxPatchUser({ ...data, id: rowEdited.idUser });
      // }
      reduxPatchUser({ ...data, id: rowEdited.idUser });
    } else {
      reduxPostUser(data);
    }
    reset();
    reduxResetUserForm();
    setShow(false);
  };

  useEffect(() => {
    if (user || rowUpdated || rowDeleted) {
      reduxGetUsers({
        page: currentPage,
        offset: offset,
        search: search,
      });
      reduxResetUserForm();
    }
  }, [user, rowUpdated, rowDeleted]);

  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h1 className="h3 mb-0 text-gray-800 mr-3">Usuarios</h1>
                <Show when="feature:create-user">
                  <button
                    className="btn btn-primary btn-circle"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fas fa-plus fa-sm"></i>
                  </button>
                </Show>
              </div>
              <p className="mb-4">Módulo de Administración de usuarios</p>
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Listado de Usuarios
                  </h6>
                </div>
                <div className="card-body">
                  <Grid
                    cols={columns}
                    data={
                      users && Object.keys(users).length > 0 ? users.items : []
                    }
                    page={
                      users && Object.keys(users).length > 0
                        ? Number(users.page)
                        : currentPage
                    }
                    pages={
                      users && Object.keys(users).length > 0
                        ? Number(users.totalPages)
                        : 1
                    }
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRange={(value) => {
                      reduxGetUsers({
                        page: 1,
                        offset: value,
                        search: search,
                      });
                    }}
                    defaultValue={search}
                    onChangeSearch={(value) => {
                      setSearch(value);
                      reduxGetUsers({
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
              <Modal.Title>
                {rowEdited ? "Editar" : "Nuevo"} Usuario
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      Primer Nombre
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className={`form-control form-control-user ${errors.firstName && "is-invalid"
                        }`}
                      {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                      <span className="invalid-feedback">
                        El primer nombre es requerido
                      </span>
                    )}
                  </div>
                </div>
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="secondName" className="form-label">
                      Segundo Nombre
                    </label>
                    <input
                      id="secondName"
                      type="text"
                      className={`form-control form-control-user ${errors.secondName && "is-invalid"
                        }`}
                      {...register("secondName")}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Primer Apellido
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className={`form-control form-control-user ${errors.lastName && "is-invalid"
                        }`}
                      {...register("lastName", { required: true })}
                    />
                    {errors.lastName && (
                      <span className="invalid-feedback">
                        El primer apellido es requerido
                      </span>
                    )}
                  </div>
                </div>
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="secondLastName" className="form-label">
                      Segundo Apellido
                    </label>
                    <input
                      id="secondLastName"
                      type="text"
                      className={`form-control form-control-user ${errors.secondLastName && "is-invalid"
                        }`}
                      {...register("secondLastName")}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="documentNumber" className="form-label">
                      Documento
                    </label>
                    <input
                      id="documentNumber"
                      type="number"
                      className={`form-control form-control-user ${errors.documentNumber && "is-invalid"
                        }`}
                      {...register("documentNumber", { required: true })}
                    />
                    {errors.documentNumber && (
                      <span className="invalid-feedback">
                        El documento es requerido
                      </span>
                    )}
                  </div>
                </div>
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control form-control-user ${errors.email && "is-invalid"
                        }`}
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="invalid-feedback">
                        El correo electrónico es requerido
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className={`form-control form-control-user ${errors.phone && "is-invalid"
                        }`}
                      {...register("phone")}
                    />
                  </div>
                </div>
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className={`form-control form-control-user ${errors.password && "is-invalid"
                        }`}
                      // {...register("password", {
                      //   required: rowEdited ? false : true,
                      // })}
                      {...register("password", { required: true })}
                    />
                    {/* {!rowEdited && errors.password && ( */}
                    {errors.password && (
                      <span className="invalid-feedback">
                        La contraseña es requerida
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="idRole" className="form-label">
                      Rol
                    </label>
                    <select
                      {...register("idRole", { required: true })}
                      id="idRole"
                      className={`custom-select ${errors.idRole && "is-invalid"
                        }`}
                    >
                      <option value={""}>Seleccionar…</option>
                      {roles &&
                        Object.keys(roles).length > 0 &&
                        roles.items.map((ele, key) => (
                          <option key={key} value={ele.idRole}>
                            {ele.description}
                          </option>
                        ))}
                    </select>
                    {errors.idRole && (
                      <span className="invalid-feedback">
                        El rol es requerido
                      </span>
                    )}
                  </div>
                </div>
                <div className="col s12 m6">
                  <div className="form-group">
                    <label htmlFor="userName" className="form-label">
                      Nombre de usuario
                    </label>
                    <input
                      id="userName"
                      type="userName"
                      className={`form-control form-control-user ${errors.userName && "is-invalid"
                        }`}
                      {...register("userName")}
                    />
                  </div>
                </div>
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
    users: state.userState.users,
    user: state.userState.user,
    rowEdited: state.userState.rowEdited,
    rowDeleted: state.userState.rowDeleted,
    rowUpdated: state.userState.rowUpdated,
    roles: state.roleState.roles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGetRoles: (payload) =>
      dispatch({
        type: "FETCH_ROLES_REQUEST",
        value: payload,
      }),
    reduxGetUsers: (payload) =>
      dispatch({
        type: "FETCH_USERS_REQUEST",
        value: payload,
      }),
    reduxPostUser: (payload) =>
      dispatch({
        type: "CREATE_USER_REQUEST",
        value: payload,
      }),
    reduxGetUser: (payload) =>
      dispatch({
        type: "READ_USER_REQUEST",
        value: payload,
      }),
    reduxDeleteUser: (payload) =>
      dispatch({
        type: "DELETE_USER_REQUEST",
        value: payload,
      }),
    reduxPatchUser: (payload) =>
      dispatch({
        type: "UPDATE_USER_REQUEST",
        value: payload,
      }),
    reduxResetUserForm: () =>
      dispatch({
        type: "RESET_USER_FORM",
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
