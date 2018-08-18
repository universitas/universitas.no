import { LOG_IN_SUCCESS, LOG_OUT } from 'ducks/auth'
// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const sliceLens = lens('errors')

// Selectors
const selectorFromLens = l => R.view(R.compose(sliceLens, l))

export const getErrors = R.view(sliceLens)

// Action creators
export const ADD_ERROR = 'errors/ADD_ERROR'
export const CLEAR_ERROR = 'errors/CLEAR_ERROR'
export const CLEAR_ERRORS = 'errors/CLEAR_ERRORS'
export const clearError = index => ({ type: CLEAR_ERROR, payload: { index } })
export const clearErrors = () => ({ type: CLEAR_ERRORS })
export const addError = error => ({ type: ADD_ERROR, payload: { error } })

// reducers
const initialState = []

const getReducer = ({ type, payload }) => {
  switch (type) {
    case ADD_ERROR:
      return R.append(payload.error)
    case CLEAR_ERROR:
      return R.remove(payload.index, 1)
    case LOG_IN_SUCCESS:
    case LOG_OUT:
    case CLEAR_ERRORS:
      return R.always(initialState)
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
