import { PUSH_PHOTO } from 'ducks/actions.js'
import { ITEM_ADDED, ITEMS_FETCHED } from 'ducks/basemodel.js'
import { modelFuncs } from './basemodelSaga.js'
import {
  modelSelectors,
  modelActions,
  actionModelLens,
} from 'ducks/basemodel.js'

import {
  takeLatest,
  takeEvery,
  select,
  call,
  cancel,
  put,
  all,
  fork,
  spawn,
  take,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'

const nextWednesday = date => {
  const dt = date ? new Date(date) : new Date()
  dt.setDate(dt.getDate() + ((10 - dt.getDay()) % 7 || 7))
  return dt.toISOString().slice(0, 10)
}

export default function* miscSaga() {
  yield takeEvery(PUSH_PHOTO, pushPhotoSaga)
  yield takeEvery(ITEM_ADDED, newIssueSaga)
  yield takeEvery(ITEMS_FETCHED, newIssueSaga)
}

function* newIssueSaga(action) {
  if (R.view(actionModelLens)(action) != 'issues') return
  const { getItems, fieldChanged, itemPatchSuccess } = modelFuncs(action)
  const issues = yield select(getItems)
  const pubdate = 'publication_date'
  const nextIssue = R.pipe(
    R.pluck(pubdate),
    R.values,
    R.sort(R.sub),
    R.last,
    nextWednesday,
    R.curry(fieldChanged)(0, pubdate),
  )(issues)
  yield put(nextIssue)
}

function* pushPhotoSaga(action) {
  const { id } = action.payload
  const { response, error } = yield call(pushImageFile, id)
  if (error) put(errorAction(error))
}
