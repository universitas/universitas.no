import R from 'ramda'
import { debounce } from 'lodash'
import { searchUrl, apiFetch } from './api'

const DEBOUNCE_TIMEOUT = 500 // wait n ms before calling api

export const TOGGLE_IMAGE_TYPE = 'imagelist/TOGGLE_IMAGE_TYPE'
export const TOGGLE_THUMB_STYLE = 'imagelist/TOGGLE_THUMB_STYLE'
export const CLEAR_SEARCH = 'imagelist/CLEAR_SEARCH'
export const SEARCH_CHANGED = 'imagelist/SEARCH_CHANGED'
export const FETCHING_IMAGES = 'imagelist/FETCHING_IMAGES'
export const FETCHED_IMAGES = 'imagelist/FETCHED_IMAGES'

export const getImages = state => state.ui.imageList.ids

export const searchChanged = text => ({
  type: SEARCH_CHANGED,
  payload: { text },
})
export const toggleThumbStyle = () => ({
  type: TOGGLE_THUMB_STYLE,
  payload: {},
})
export const toggleImageType = option => ({
  type: TOGGLE_IMAGE_TYPE,
  payload: { option },
})
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
  payload: {},
})
export const fetchingImages = () => ({
  type: FETCHING_IMAGES,
  payload: {},
})

const fetchedImages = ({ url, count, next, previous, results }) => ({
  type: FETCHED_IMAGES,
  payload: { url, count, next, previous, ids: R.keys(results) },
})

// thunks
export const searchAction = text => (dispatch, getState) => {
  dispatch(searchChanged(text))
  debouncedDoSearch(dispatch, { search: text })
}

export const nextAction = () => (dispatch, getState) => {
  const url = getState().searchField.next
  fetchImages(dispatch, url)
}

export const refreshAction = () => (dispatch, getState) => {
  const url = getState().searchField.url
  fetchImages(dispatch, url)
}

export const prevAction = () => (dispatch, getState) => {
  const url = getState().searchField.previous
  fetchImages(dispatch, url)
}
export const fetchAction = () => (dispatch, getState) => {
  fetchImages(dispatch, searchUrl('images')())
}

const doSearch = (dispatch, attrs = {}) => {
  if (attrs.search === '') {
    dispatch(clearSearch())
    return
  }
  attrs.limit = 20
  const url = searchUrl('images')(attrs)
  fetchImages(dispatch, url)
}
const debouncedDoSearch = debounce(doSearch, DEBOUNCE_TIMEOUT)

const fetchImages = (dispatch, url) => {
  apiFetch(dispatch, url).then(data => {
    data.results.forEach(img => dispatch(addImage(img)))
    dispatch(fetchedImages(data))
  })
}

// reducers
const defaultState = { ids: [], text: '', thumbStyle: 0, fetching: false }

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_SEARCH:
      return defaultState
    case SEARCH_CHANGED:
      return { ...state, ...action.payload }
    case TOGGLE_THUMB_STYLE:
      return { ...state, thumbStyle: (state.thumbStyle + 1) % 3 }
    case TOGGLE_IMAGE_TYPE:
      return { ...state, fetching: true, ...action.payload }
    case FETCHED_IMAGES:
      return { ...state, fetching: false, ...action.payload }
    case FETCHING_IMAGES:
      return { ...state, fetching: true }
    default:
      return state
  }
}
