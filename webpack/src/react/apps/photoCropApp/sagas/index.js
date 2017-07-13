import { all, fork } from 'redux-saga/effects'
import imageSagas from './images'

export function* helloSaga() {
  console.log('hello sagas')
}

export default function* rootSagas() {
  yield [fork(helloSaga), fork(imageSagas)]
}
