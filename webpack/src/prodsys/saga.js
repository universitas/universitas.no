import { all, fork, call, put, takeEvery } from 'redux-saga/effects'
import errorSaga from 'prodsys/sagas/errorSaga'
import basemodelSaga from 'prodsys/sagas/basemodelSaga'
import uploadSaga from 'prodsys/sagas/uploadSaga'
import storySaga from 'prodsys/sagas/storySaga'
import miscSaga from 'prodsys/sagas/miscSaga'
import { modelActions } from 'prodsys/ducks/basemodel'
import authSaga from 'common/sagas/authSaga'
import { requestUser, REQUEST_USER_SUCCESS } from 'common/ducks/auth'
import { apiUrlToId } from 'utils/urls'

function* rootSaga() {
  yield all([
    fork(basemodelSaga),
    fork(uploadSaga),
    fork(errorSaga),
    fork(authSaga),
    fork(storySaga),
    fork(miscSaga),
    fork(fetchMoreSaga),
    call(loadInitialData),
  ])
}

function* fetchMoreSaga() {
  yield takeEvery(REQUEST_USER_SUCCESS, fetchContributor)
}

function* fetchContributor({ payload }) {
  const contributor = apiUrlToId(payload.contributor)
  const action = modelActions('contributors').itemRequested(contributor)
  yield put(action)
}

function* loadInitialData() {
  yield put(requestUser())
  yield put(modelActions('storytypes').itemsRequested())
  yield put(modelActions('contributors').itemsRequested())
  yield put(modelActions('stories').itemsRequested())
  yield put(modelActions('photos').itemsRequested())
  yield put(modelActions('positions').itemsRequested())
  // yield put(modelActions('issues').itemsRequested())
  // yield put(modelActions('frontpage').itemsRequested())
}

export default rootSaga
