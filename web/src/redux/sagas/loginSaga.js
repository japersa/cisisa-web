import { call, put, takeLatest } from "redux-saga/effects";
import request from "../../utils/request";

function* login({ data }) {
  try {
    yield put({
      type: "LOGIN_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/auth`;

    const response = yield call(request, requestURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { user, payload } = response;

    const { role } = user;

    const permissions = role.permissionsRoles.map((elem) => {
      return elem.permission.name;
    });

    yield put({
      type: "HIDE_LOADING",
    });

    yield put({
      type: "DEFINE_PERMISSIONS",
      payload: permissions,
    });

    yield put({ type: "SIGN_IN", payload: user });

    /* 
    if (permissions.length > 0) { */
    localStorage.setItem("token", payload.accessToken);

    yield put({
      type: "LOGIN_SUCCESS",
    });
    /*     } else {
      yield put({
        type: 'SHOW_ALERT',
        value: {
          type: 'danger',
          title: 'Falied login',
          message: `You don't have associated permissions`
        }
      });
      yield put({
        type: 'LOGIN_ERROR',
      });
    } */
  } catch (error) {
    yield put({
      type: "DEFINE_PERMISSIONS",
      payload: [],
    });

    yield put({
      type: "HIDE_LOADING",
    });

    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied login",
        message: "Invalid username or password",
      },
    });
    yield put({
      type: "LOGIN_ERROR",
    });
  }
}

function* validateToken() {
  try {
    yield put({
      type: "LOGIN_REQUESTING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/auth/validate-token`;

    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };

    const response = yield call(request, requestURL, headers);

    const { role } = response;

    const permissions = role.permissionsRoles.map((elem) => {
      return elem.permission.name;
    });

    yield put({
      type: "DEFINE_PERMISSIONS",
      payload: permissions,
    });

    yield put({ type: "RESTORE_SESION", payload: response });
  } catch (error) {
    yield put({
      type: "DEFINE_PERMISSIONS",
      payload: [],
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied login",
        message: "Invalid token",
      },
    });
  }
}

export function* watchLogin() {
  yield takeLatest("LOGIN_REQUEST", login);
  yield takeLatest("VALIDATE_TOKEN", validateToken);
}
