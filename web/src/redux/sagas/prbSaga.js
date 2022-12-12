import { call, put, takeLatest } from "redux-saga/effects";
import request from "../../utils/request";

function* getAllPrbs(payload) {
  try {
    yield put({
      type: "FETCH_PRBS_REQUESTING",
    });

    yield put({
      type: "SHOW_LOADING",
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/prbs/findbyCode/${payload.data.code}`;
    const headers = {
      method: "GET",
    };
    const response = yield call(request, requestURL, headers);

    yield put({
      type: "HIDE_LOADING",
    });

    yield put({
      type: "FETCH_PRBS_SUCCESS",
      value: response,
    });
  } catch (error) {
    console.log(error)
    yield put({
      type: "HIDE_LOADING",
    });
    yield put({
      type: "SHOW_ALERT",
      value: {
        type: "danger",
        title: "Falied load",
        message: "Falied load prbs",
      },
    });
    yield put({
      type: "FETCH_PRBS_ERROR",
    });
  }
}


export function* watchPrb() {
  yield takeLatest("FETCH_PRBS_REQUEST", getAllPrbs);
}
