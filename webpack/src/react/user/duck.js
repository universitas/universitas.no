import R from 'ramda' // Action constants
export const LOG_IN = 'user/LOG_IN'
export const LOGGED_IN = 'user/LOGGED_IN'
export const LOG_OUT = 'user/LOG_OUT'
export const REQUEST_USER = 'user/REQUEST_USER'
export const REQUEST_USER_SUCCESS = 'user/REQUEST_USER_SUCCESS'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const sliceLens = lens('user')
const tokenLens = lens('key')
const pendingLens = lens('pending')

// Selectors
const selectorFromLens = l => R.view(R.compose(sliceLens, l))

export const getUser = R.view(sliceLens)
export const getAuthToken = selectorFromLens(tokenLens)

// Action creators

export const logOut = () => ({ type: LOG_OUT, payload: {} })
export const logIn = (username, password) => ({
  type: LOG_IN,
  payload: { username, password },
})
export const loginSuccess = ({ key }) => ({ type: LOGGED_IN, payload: { key } })
export const requestUser = () => ({ type: REQUEST_USER, payload: {} })
export const requestUserSuccess = data => ({
  type: REQUEST_USER_SUCCESS,
  payload: data,
})

// reducers
const initialState = { pending: false }

const getReducer = ({ type, payload }) => {
  switch (type) {
    case LOG_IN:
      return R.always({ pending: true })
    case LOGGED_IN:
      return R.compose(R.set(keyLens(payload.key)), R.set(pendingLens(false)))
    case REQUEST_USER_SUCCESS:
      return R.mergeDeepRight(payload)
    case LOG_OUT:
      return R.always(initialState)
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
