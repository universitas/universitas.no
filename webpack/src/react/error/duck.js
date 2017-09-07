// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const sliceLens = lens('errors')

// Selectors
const selectorFromLens = l => R.view(R.compose(sliceLens, l))

export const getErrors = R.view(sliceLens)

// Action creators
export const CLEAR_ERROR = 'errors/CLEAR_ERROR'
export const clearError = index => ({
  type: CLEAR_ERROR,
  payload: { index },
})
export const CLEAR_ERRORS = 'errors/CLEAR_ERRORS'
export const clearErrors = () => ({ type: CLEAR_ERRORS })

// reducers
const initialState = ['a', 'b', 'c']

const getReducer = ({ type, payload, error }) => {
  if (error) return R.append(error)
  switch (type) {
    case CLEAR_ERROR:
      return R.remove(payload.index, 1)
    case CLEAR_ERRORS:
      return initialState
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
