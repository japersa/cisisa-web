import { call, put, takeLatest } from "redux-saga/effects";
import request from "../../utils/request";

function* getAllPermissionsRoles(payload) {
  try {
    yield put({
      type: "FETCH_PERMISSIONS_ROLES_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/permissionsRoles?page=${payload.value.page}&search=${payload.value.search}&offset=${payload.value.offset}`;
    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "FETCH_PERMISSION_ROLES_SUCCESS",
      value: response,
    });
    yield put({
      type: "HIDE_LOADING",
    });
  } catch (error) {
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied load",
        message: "Falied load Permissions roles",
      },
    });
    yield put({
      type: "FETCH_PERMISSION_ROLES_ERROR",
    });
  }
}

function* postPermissionRole(payload) {
  try {
    yield put({ type: "CREATE_PERMISSION_ROLES_REQUESTING" });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/permissionsRoles`;

    const headers = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload.value),
    };

    const response = yield call(request, requestURL, headers);

    yield put({
      type: "CREATE_PERMISSION_ROLES_SUCCESS",
      value: response,
    });
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "success",
        title: "Successful save",
        message: "Successful save Permission role",
      },
    });
  } catch (error) {
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied save",
        message: "Falied save Permission role",
      },
    });
    yield put({
      type: "CREATE_PERMISSION_ROLES_ERROR",
    });
  }
}

function* getPermissionRoleById(payload) {
  try {
    yield put({
      type: "READ_PERMISSION_ROLES_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/permissionsRoles/${payload.value.id}`;

    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "READ_PERMISSION_ROLES_SUCCESS",
      value: response,
    });
    yield put({
      type: "HIDE_LOADING",
    });
  } catch (error) {
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "READ_PERMISSION_ROLES_ERROR",
    });
  }
}

function* deletePermissionRoleById(payload) {
  try {
    yield put({
      type: "DELETE_PERMISSION_ROLES_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/permissionsRoles/changeState/${payload.value.idPermission}`;

    const headers = {
      method: "PATCH",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload.value),
    };

    const response = yield call(request, requestURL, headers);

    yield put({
      type: "DELETE_PERMISSION_ROLES_SUCCESS",
      value: response,
    });
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "success",
        title: "Successful disable",
        message: "Successful disable Permission role",
      },
    });
  } catch (error) {
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied disable",
        message: "Falied disable Permission role",
      },
    });
    yield put({
      type: "DELETE_PERMISSION_ROLES_ERROR",
    });
  }
}

function* updatePermissionRole(payload) {
  try {
    yield put({
      type: "UPDATE_PERMISSION_ROLES_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/permissionsRoles/${payload.value.id}`;

    const headers = {
      method: "PATCH",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload.value),
    };

    const response = yield call(request, requestURL, headers);

    yield put({
      type: "UPDATE_PERMISSION_ROLES_SUCCESS",
      value: response,
    });
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "success",
        title: "Successful update",
        message: "Successful update Permission role",
      },
    });
  } catch (error) {
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied update",
        message: "Falied update Permission role",
      },
    });
    yield put({
      type: "UPDATE_PERMISSION_ROLES_ERROR",
    });
  }
}

export function* watchPermissionRole() {
  yield takeLatest("FETCH_PERMISSIONS_ROLES_REQUEST", getAllPermissionsRoles);
  yield takeLatest("CREATE_PERMISSION_ROLES_REQUEST", postPermissionRole);
  yield takeLatest("READ_PERMISSION_ROLES_REQUEST", getPermissionRoleById);
  yield takeLatest("DELETE_PERMISSION_ROLES_REQUEST", deletePermissionRoleById);
  yield takeLatest("UPDATE_PERMISSION_ROLES_REQUEST", updatePermissionRole);
}
