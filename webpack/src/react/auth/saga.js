import { takeEvery, select, call, put } from 'redux-saga/effects'
import { apiLogin, apiLogout, apiUser } from '../services/api'
import {
  LOG_IN,
  LOG_OUT,
  REQUEST_USER,
  loginSuccess,
  loginFailed,
  requestUserSuccess,
  requestUserFailed,
} from 'auth/duck'

export default function* rootSaga() {
  yield takeEvery(LOG_OUT, logOutSaga)
  yield takeEvery(LOG_IN, logInSaga)
  yield takeEvery(REQUEST_USER, fetchUserSaga)
}

function* logInSaga(action) {
  const { response, error } = yield call(apiLogin, action.payload)
  if (error) {
    yield put(loginFailed(error))
  } else {
    yield put(loginSuccess(response))
    // login successful reload page to get new csrf token
    // window.location = window.location
    // csrf token checked for each request
    yield fetchUserSaga()
  }
}
function* logOutSaga(action) {
  yield call(apiLogout)
}
function* fetchUserSaga(action) {
  const { response, error } = yield call(apiUser)
  if (error) {
    yield put(requestUserFailed(error))
  } else {
    yield put(requestUserSuccess(response))
  }
}
