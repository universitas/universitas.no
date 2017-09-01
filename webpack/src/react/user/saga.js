import { takeEvery, select, call, put } from 'redux-saga/effects'
import { apiLogin, apiLogout, apiUser } from '../services/api'
import {
  LOG_IN,
  LOG_OUT,
  REQUEST_USER,
  loginSuccess,
  requestUserSuccess,
} from './duck'

export default function* rootSaga() {
  yield takeEvery(LOG_OUT, logOutSaga)
  yield takeEvery(LOG_IN, logInSaga)
  yield takeEvery(REQUEST_USER, fetchUserSaga)
}

function* logInSaga(action) {
  const { response, error } = yield call(apiLogin, action.payload)
  if (error) {
    yield put({ type: 'ERROR', error })
  } else {
    // reload page on success.
    window.location = '/prodsys/'
    yield call(fetchUserSaga, action)
    yield put(loginSuccess(response))
  }
}
function* logOutSaga(action) {
  const { response, error } = yield call(apiLogout)
  if (error) {
    yield put({ type: 'ERROR', error })
  }
}
function* fetchUserSaga(action) {
  console.log('fetch user')
  console.dir(action)
  const { response, error } = yield call(apiUser)
  if (error) {
    yield put({ type: 'ERROR', error })
  } else {
    yield put(requestUserSuccess(response))
  }
}
