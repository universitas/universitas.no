import { all, fork } from 'redux-saga/effects'
import issuesSaga from 'sagas/issues'

function* rootSaga() {
  yield [fork(issuesSaga)]
}

export default rootSaga
