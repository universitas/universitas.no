import R from 'ramda'
import {
  takeLatest,
  takeEvery,
  select,
  call,
  put,
  all,
  fork,
  take,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { apiList, apiGet } from '../services/api'
import {
  issuesFetched,
  issueSelected,
  ITEMS_REQUESTED,
  ITEM_SELECTED,
  getIssue,
  issueAdded,
} from './duck'

export default function* rootSaga() {
  yield takeLatest(ITEM_SELECTED, selectIssue)
  yield takeEvery(ITEMS_REQUESTED, requestIssues)
  yield fork(watchRouteChange)
}

const getModel = action => {
  let result = R.path(['payload', 'result'])(action)
  while (result) {
    let { parent, model } = result
    if (model) return model
    result = parent
  }
  return null
}

function* watchRouteChange() {
  while (true) {
    const action = yield take('ROUTER_LOCATION_CHANGED')
    if (getModel(action) == 'issue') yield fork(requestIssues, action)
    const id = R.path(['payload', 'params', 'id'])(action)
    if (id) {
      yield put(issueSelected(id))
    }
  }
}

function* selectIssue(action) {
  const id = action.payload.id
  let data = yield select(getIssue, id)
  if (!data) {
    data = yield call(apiGet('issues'), id)
    yield put(issueAdded(data))
  }
}
function* requestIssues(action) {
  console.log('request Issues')
  const data = yield call(fetchIssues)
  if (data) {
    yield put(issuesFetched(data))
  }
}

function* fetchIssues() {
  const { response, error } = yield call(apiList, 'issues')
  if (response) {
    return response
  } else {
    yield put({ type: 'ERROR', error })
  }
}
