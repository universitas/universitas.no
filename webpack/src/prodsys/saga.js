import { all, fork, call, put, take } from 'redux-saga/effects'
import authSaga from 'sagas/authSaga'
import errorSaga from 'sagas/errorSaga'
import basemodelSaga from 'sagas/basemodelSaga'
import uploadSaga from 'sagas/uploadSaga'
import storyimageSaga from 'sagas/storyimageSaga'
import { modelActions } from 'ducks/basemodel'
import { requestUser } from 'ducks/auth'

function* rootSaga() {
  yield all([
    fork(uploadSaga),
    fork(basemodelSaga),
    fork(errorSaga),
    fork(authSaga),
    fork(storyimageSaga),
    call(loadInitialData),
  ])
}

function* loadInitialData() {
  yield put(modelActions('stories').itemsRequested())
  yield put(modelActions('photos').itemsRequested())
  yield put(modelActions('storyimages').itemsRequested())
  yield put(modelActions('storytypes').itemsRequested())
  yield put(modelActions('contributors').itemsRequested())
  yield put(modelActions('issues').itemsRequested())
  yield put(modelActions('frontpage').itemsRequested())
  yield put(requestUser())
}

export default rootSaga
