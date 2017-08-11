import { all, fork } from 'redux-saga/effects'
import issuesSaga from 'issues/saga'
import contributorsSaga from 'contributors/saga'
import photosSaga from 'photos/saga'

function* rootSaga() {
  yield [fork(issuesSaga), fork(contributorsSaga), fork(photosSaga)]
}

export default rootSaga
