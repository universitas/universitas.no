// Lenses
const SLICE = 'ux'

// dotted path -> selector
const selector = R.pipe(
  R.split('.'),
  R.concat([SLICE]),
  R.lensPath,
  R.view,
)

// Selectors
export const getUx = R.view(R.lensProp(SLICE))
export const getZoom = selector('zoom')
export const getPanes = selector('panes')

// Action creators
export const SET_ZOOM = 'ux/SET_ZOOM'
export const setZoom = zoom => ({
  type: SET_ZOOM,
  payload: { zoom },
})
export const TOGGLE_PANE = 'ux/TOGGLE_PANE'
export const togglePane = (pane, state) => ({
  type: TOGGLE_PANE,
  payload: { [pane]: state },
})

// reducers
const initialState = { zoom: undefined, panes: {} }

const getReducer = ({ type, payload }) => {
  switch (type) {
    case TOGGLE_PANE:
      return R.over(R.lensProp('panes'), R.mergeLeft(payload))
    case SET_ZOOM:
      return R.mergeLeft(payload)
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
