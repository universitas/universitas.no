import { takeEvery, put } from 'redux-saga/effects'
import { addError } from './duck'

export default function* rootSaga() {
  yield takeEvery('*', errorWatcher)
}

function* errorWatcher({ error }) {
  if (error) {
    error.timestamp = new Date().toISOString()
    yield put(addError(error))
  }
}
