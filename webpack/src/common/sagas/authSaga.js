import { takeEvery, select, call, put } from 'redux-saga/effects'
import { apiLogin, apiLogout, apiUser } from 'services/api'
import Raven from 'raven-js'
import {
  LOG_IN,
  LOG_OUT,
  REQUEST_USER,
  loginSuccess,
  loginFailed,
  requestUserSuccess,
  requestUserFailed,
} from 'ducks/auth'

export default function* rootSaga() {
  yield takeEvery(LOG_OUT, logOutSaga)
  yield takeEvery(LOG_IN, logInSaga)
  yield takeEvery(REQUEST_USER, fetchUserSaga)
}

const setUserContext = ({ pk, email, contributor_name }) => {
  const user = { id: pk, name: contributor_name, email }
  if (process.env.NODE_ENV == 'production') Raven.setUserContext(user)
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
    yield call(setUserContext, response)
  }
}
