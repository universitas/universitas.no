import { all, fork, call, put, take } from 'redux-saga/effects'

function* rootSaga() {
  yield [fork(frontPageSaga)]
}

export default rootSaga
