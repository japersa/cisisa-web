import { call, put, takeLatest } from "redux-saga/effects";
import request from "../../utils/request";

function* getAllNeighborhoods(payload) {
  try {
    yield put({
      type: "FETCH_NEIGHBORHOODS_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods?page=${payload.value.page}&search=${payload.value.search}&offset=${payload.value.offset}`;
    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "FETCH_NEIGHBORHOOD_SUCCESS",
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
        message: "Falied load Neighborhoods",
      },
    });
    yield put({
      type: "FETCH_NEIGHBORHOOD_ERROR",
    });
  }
}

function* postNeighborhood(payload) {
  try {
    yield put({ type: "CREATE_NEIGHBORHOOD_REQUESTING" });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods`;

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
      type: "CREATE_NEIGHBORHOOD_SUCCESS",
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
        message: "Successful save Neighborhood",
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
        message: "Falied save Neighborhood",
      },
    });
    yield put({
      type: "CREATE_NEIGHBORHOOD_ERROR",
    });
  }
}

function* getNeighborhoodById(payload) {
  try {
    yield put({
      type: "READ_NEIGHBORHOOD_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods/${payload.value.id}`;

    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "READ_NEIGHBORHOOD_SUCCESS",
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
      type: "READ_NEIGHBORHOOD_ERROR",
    });
  }
}

function* deleteNeighborhoodById(payload) {
  try {
    yield put({
      type: "DELETE_NEIGHBORHOOD_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods/changeState/${payload.value.idNeighborhood}`;

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
      type: "DELETE_NEIGHBORHOOD_SUCCESS",
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
        message: "Successful disable Neighborhood",
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
        message: "Falied disable Neighborhood",
      },
    });
    yield put({
      type: "DELETE_NEIGHBORHOOD_ERROR",
    });
  }
}

function* updateNeighborhood(payload) {
  try {
    yield put({
      type: "UPDATE_NEIGHBORHOOD_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods/${payload.value.id}`;

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
      type: "UPDATE_NEIGHBORHOOD_SUCCESS",
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
        message: "Successful update Neigborhood",
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
        message: "Falied update Neighborhood",
      },
    });
    yield put({
      type: "UPDATE_NEIGHBORHOOD_ERROR",
    });
  }
}

function* getNeighborhoodsByCityId(payload) {
  try {
    yield put({
      type: "READBYCITY_NEIGHBORHOOD_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods/city/${payload.value.idCity}`;

    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "READBYCITY_NEIGHBORHOOD_SUCCESS",
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
      type: "READBYCITY_NEIGHBORHOOD_ERROR",
    });
  }
}

function* getNeighborhoodsByZoneId(payload) {
  try {
    yield put({
      type: "READBYZONE_NEIGHBORHOOD_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });
    
    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/neighborhoods/zone/${payload.value.idZone}`;

    const headers = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }),
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "READBYZONE_NEIGHBORHOOD_SUCCESS",
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
      type: "READBYZONE_NEIGHBORHOOD_ERROR",
    });
  }
}

export function* watchNeighborhood() {
  yield takeLatest("FETCH_NEIGHBORHOODS_REQUEST", getAllNeighborhoods);
  yield takeLatest("CREATE_NEIGHBORHOOD_REQUEST", postNeighborhood);
  yield takeLatest("READ_NEIGHBORHOOD_REQUEST", getNeighborhoodById);
  yield takeLatest("DELETE_NEIGHBORHOOD_REQUEST", deleteNeighborhoodById);
  yield takeLatest("UPDATE_NEIGHBORHOOD_REQUEST", updateNeighborhood);
  yield takeLatest("READBYCITY_NEIGHBORHOOD_REQUEST", getNeighborhoodsByCityId);
  yield takeLatest("READBYZONE_NEIGHBORHOOD_REQUEST", getNeighborhoodsByZoneId);
}
