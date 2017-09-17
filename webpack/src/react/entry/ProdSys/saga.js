import { all, fork, call, put, take } from 'redux-saga/effects'
import storiesSaga from 'stories/saga'
import storyTypesSaga from 'storytypes/saga'
import authSaga from 'auth/saga'
import errorSaga from 'error/saga'
import apiSaga from 'sagas/apisaga'
import { modelActions } from 'ducks/basemodel'
import { requestUser } from 'auth/duck'
import { storiesRequested } from 'stories/duck'
import { storyTypesRequested } from 'storytypes/duck'
import { push, LOCATION_CHANGED } from 'redux-little-router'

function* rootSaga() {
  yield [
    fork(apiSaga),
    fork(errorSaga),
    fork(authSaga),
    fork(storiesSaga),
    fork(storyTypesSaga),
    call(initialData),
  ]
}

function* initialData() {
  yield put(modelActions('contributors').itemsRequested())
  yield put(modelActions('images').itemsRequested())
  yield put(modelActions('issues').itemsRequested())
  yield put(requestUser())
  yield put(storyTypesRequested())
  yield put(storiesRequested())
  const action = yield take(LOCATION_CHANGED)
  if (R.pathEq(['payload', 'route'], '/')(action)) {
    yield put(push('/stories'))
  }
}

export default rootSaga
