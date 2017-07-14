import { all, fork } from 'redux-saga/effects'
import imageSagas from './images'

export default function* rootSagas() {
  yield [fork(imageSagas)]
}
