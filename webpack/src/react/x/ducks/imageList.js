// prodsys image ducks

export const IMAGES_FETCH_SUCCESS = 'imagelist/IMAGES_FETCH_SUCCESS'
export const IMAGES_FETCH_START = 'imagelist/IMAGES_FETCH_START'
export const SEARCH_CHANGED = 'imagelist/SEARCH_CHANGED'
export const SEARCH_URL_CHANGED = 'imagelist/SEARCH_URL_CHANGED'
export const THUMB_STYLE_CYCLE = 'imagelist/THUMB_STYLE_CYCLE'

export const getNext = state => state.ui.imageList.next
export const getUrl = state => state.ui.imageList.url
export const getPrevious = state => state.ui.imageList.previous
export const getImages = state => state.ui.imageList.ids
export const getImageList = state => state.ui.imageList
export const getThumbStyle = state => state.ui.imageList.thumbStyle

export const searchChanged = searchText => ({
  type: SEARCH_CHANGED,
  payload: { searchText },
})
export const searchUrlChanged = url => ({
  type: SEARCH_URL_CHANGED,
  payload: { url },
})
export const thumbStyleCycle = () => ({
  type: THUMB_STYLE_CYCLE,
})
export const imagesFetchSuccess = data => ({
  type: IMAGES_FETCH_SUCCESS,
  payload: data,
})

// reducers
const defaultState = {
  ids: [],
  searchText: '',
  thumbStyle: 0,
  fetching: false,
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_CHANGED:
      return action.payload.searchText
        ? { ...state, searchText: action.payload.searchText }
        : defaultState
    case SEARCH_URL_CHANGED:
      return { ...state, url: action.payload.url }
    case THUMB_STYLE_CYCLE:
      return { ...state, thumbStyle: (state.thumbStyle + 1) % 3 }
    case IMAGES_FETCH_SUCCESS: {
      const { results, ...payload } = action.payload
      const ids = R.values(R.pluck('id', results))
      return { ...state, ...payload, ids, fetching: false }
    }
    case IMAGES_FETCH_START:
      return { ...state, fetching: true }
    default:
      return state
  }
}
