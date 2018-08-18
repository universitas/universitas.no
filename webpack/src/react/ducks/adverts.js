const SLICE = 'adverts'

// Lenses
const sliceLens = R.lensProp(SLICE)

// Selectors
export const getAdverts = R.view(sliceLens)

// Actions
export const ADVERTS_REQUESTED = 'adverts/ADVERTS_REQUESTED'
export const advertsRequested = () => ({ type: ADVERTS_REQUESTED, payload: {} })

export const ADVERTS_FETCHING = 'adverts/ADVERTS_FETCHING'
export const advertsFetching = () => ({ type: ADVERTS_FETCHING, payload: {} })

export const ADVERTS_FETCH_SUCCESS = 'adverts/ADVERTS_FETCH_SUCCESS'
export const advertsFetchSuccess = ({ qmedia }) => ({
  type: ADVERTS_FETCH_SUCCESS,
  payload: { qmedia },
})

const mergeLeft = R.flip(R.merge)

const getReducer = ({ type, payload, error }) => {
  switch (type) {
    case ADVERTS_FETCHING:
      return mergeLeft({ fetching: true })
    case ADVERTS_FETCH_SUCCESS:
      return mergeLeft({ fetching: false, ...payload })
    default:
      return R.identity
  }
}

export default (state = { fetching: false }, action) =>
  getReducer(action)(state)
