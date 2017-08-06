import { all, fork } from 'redux-saga/effects'
import issuesSaga from 'issues/saga'

function* rootSaga() {
  yield [fork(issuesSaga)]
}

export default rootSaga
