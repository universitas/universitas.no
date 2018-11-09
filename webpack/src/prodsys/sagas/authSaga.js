import { takeEvery, select, call, put } from 'redux-saga/effects'
import { apiLogin, apiLogout, apiUser } from 'services/api'
import { modelActions } from 'ducks/basemodel'
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

const { itemRequested: contributorRequested } = modelActions('contributors')

export default function* rootSaga() {
  yield takeEvery(LOG_OUT, logOutSaga)
  yield takeEvery(LOG_IN, logInSaga)
  yield takeEvery(REQUEST_USER, fetchUserSaga)
}

// calls api to log out and clears session cookie
function* logOutSaga(action) {
  yield call(apiLogout)
}

// tries to log in user
function* logInSaga(action) {
  const { response, error } = yield call(apiLogin, action.payload)
  if (error) {
    yield put(loginFailed(error))
  } else {
    yield put(loginSuccess(response))
    yield fetchUserSaga(action)
  }
}

// fetch user data and contributor data from api
function* fetchUserSaga(action) {
  const { response, error } = yield call(apiUser)
  if (error) {
    yield put(requestUserFailed(error))
  } else {
    yield put(requestUserSuccess(response))
    const { pk, contributor_name, contributor, email } = response
    const ravenUser = { id: pk, name: contributor_name, email }
    // tell Raven error reporting system who the currently logged in user is.
    yield call(Raven.setUserContext, ravenUser)

    // fetch prodsys data for contributor
    yield put(contributorRequested(contributor))
  }
}
