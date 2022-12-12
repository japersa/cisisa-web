import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';

function* resetPassword({ data }) {
  try {
    yield put({
      type: 'RESETPASSWORD_REQUESTING',
    });

    yield put({
      type: 'SHOW_LOADING',
    });

    const requestURL = `account/ResetPassword`;

    // eslint-disable-next-line no-unused-vars
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    yield put({
      type: 'RESETPASSWORD_SUCCESS',
    });
    yield put({
      type: 'HIDE_LOADING',
    });
  } catch (error) {
    yield put({
      type: 'HIDE_LOADING',
    });
    yield put({
      type: 'RESETPASSWORD_ERROR',
    });
  }
}

export function* watchResetPassword() {
  yield takeLatest('RESETPASSWORD_REQUEST', resetPassword);
}
