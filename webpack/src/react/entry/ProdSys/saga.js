import R from 'ramda'
import { all, fork, call, put, take } from 'redux-saga/effects'
import issuesSaga from 'issues/saga'
import contributorsSaga from 'contributors/saga'
import photosSaga from 'photos/saga'
import storiesSaga from 'stories/saga'
import storyTypesSaga from 'storytypes/saga'
import userSaga from 'user/saga'
import { requestUser } from 'user/duck'
import { storiesRequested } from 'stories/duck'
import { issuesRequested } from 'issues/duck'
import { photosRequested } from 'photos/duck'
import { contributorsRequested } from 'contributors/duck'
import { storyTypesRequested } from 'storytypes/duck'
import { push, LOCATION_CHANGED } from 'redux-little-router'

function* rootSaga() {
  yield [
    fork(userSaga),
    fork(storiesSaga),
    fork(issuesSaga),
    fork(contributorsSaga),
    fork(photosSaga),
    fork(storyTypesSaga),
    call(initialData),
  ]
}

function* initialData() {
  yield put(requestUser())
  yield put(storyTypesRequested())
  yield put(storiesRequested())
  yield put(issuesRequested())
  yield put(contributorsRequested())
  yield put(photosRequested())
  const action = yield take(LOCATION_CHANGED)
  if (R.pathEq(['payload', 'route'], '/')(action)) {
    yield put(push('/stories'))
  }
}

export default rootSaga
