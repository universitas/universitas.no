export const LOG_IN = 'auth/LOG_IN'
export const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS'
export const LOG_IN_FAILED = 'auth/LOG_IN_FAILED'
export const LOG_OUT = 'auth/LOG_OUT'
export const REQUEST_USER = 'auth/REQUEST_USER'
export const REQUEST_USER_SUCCESS = 'auth/REQUEST_USER_SUCCESS'
export const REQUEST_USER_FAILED = 'auth/REQUEST_USER_FAILED'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const sliceLens = lens('auth')
const tokenLens = lens('key')
const pendingLens = lens('pending')
const errorLens = lens('error')

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
export const loginSuccess = ({ key }) => ({
  type: LOG_IN_SUCCESS,
  payload: { key },
})
export const loginFailed = error => ({ type: LOG_IN_FAILED, error })
export const requestUser = () => ({ type: REQUEST_USER, payload: {} })
export const requestUserSuccess = data => ({
  type: REQUEST_USER_SUCCESS,
  payload: data,
})
export const requestUserFailed = error => ({ type: REQUEST_USER_FAILED, error })

// reducers
const initialState = { pending: true, error: {} }

const getReducer = ({ type, payload, error }) => {
  switch (type) {
    // case LOG_IN:
    //   return R.always({ pending: true })
    case LOG_IN_SUCCESS:
      return R.set(tokenLens, payload.key)
    case LOG_IN_FAILED:
      return R.set(errorLens, error)
    case REQUEST_USER_SUCCESS:
      return R.compose(R.mergeDeepRight(payload), R.set(pendingLens, false))
    case REQUEST_USER_FAILED:
      return R.compose(R.set(pendingLens, false), R.set(errorLens, error))
    case LOG_OUT:
      return R.always({ pending: false, error: {} })
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
