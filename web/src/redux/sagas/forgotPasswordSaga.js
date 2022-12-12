import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';

function* forgotPassword({ data }) {
  try {
    yield put({
      type: 'FORGOTPASSWORD_REQUESTING',
    });

    yield put({
      type: 'SHOW_LOADING',
    });

    const requestURL = `${process.env.REACT_APP_API_URL}/api/v1/auth/forgot-password`;
    // eslint-disable-next-line no-unused-vars
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    yield put({
      type: 'FORGOTPASSWORD_SUCCESS',
    });
    yield put({
      type: 'HIDE_LOADING',
    });
  } catch (error) {
    yield put({
      type: 'HIDE_LOADING',
    });
    yield put({
      type: 'FORGOTPASSWORD_ERROR',
    });
  }
}

export function* watchForgotPassword() {
  yield takeLatest('FORGOTPASSWORD_REQUEST', forgotPassword);
}
