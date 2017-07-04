import R from 'ramda'
import { debounce } from 'lodash'
import { searchUrl, apiFetch } from './api'
import { addImage } from './images'

const DEBOUNCE_TIMEOUT = 500 // wait n ms before calling api

const TOGGLE_IMAGE_TYPE = 'imagelist/TOGGLE_IMAGE_TYPE'
const TOGGLE_THUMB_STYLE = 'imagelist/TOGGLE_THUMB_STYLE'
const SEARCH_CHANGED = 'imagelist/SEARCH_CHANGED'
const FETCHING_IMAGES = 'imagelist/FETCHING_IMAGES'
const FETCHED_IMAGES = 'imagelist/FETCHED_IMAGES'
const CLEAR_SEARCH = 'imagelist/CLEAR_SEARCH'
const URL_CHANGED = 'imagelist/URL_CHANGED'

const getNext = state => state.ui.imageList.next
const getUrl = state => state.ui.imageList.url
const getPrevious = state => state.ui.imageList.previous
export const getImages = state => state.ui.imageList.ids
export const getImageList = state => state.ui.imageList
export const getThumbStyle = state => state.ui.imageList.thumbStyle

export const searchChanged = text => ({
  type: SEARCH_CHANGED,
  payload: { text },
})
export const urlChanged = url => ({
  type: URL_CHANGED,
  payload: { url },
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

const fetchedImages = ({ count, next, previous, results }) => ({
  type: FETCHED_IMAGES,
  payload: {
    count,
    next,
    previous,
    ids: R.values(R.pluck('id', results)),
  },
})

// thunks
export const searchAction = text => (dispatch, getState) => {
  dispatch(searchChanged(text))
  debouncedDoSearch(dispatch, { search: text })
}

export const nextAction = () => (dispatch, getState) => {
  const url = getNext(getState())
  fetchImages(dispatch, url)
}

export const refreshAction = () => (dispatch, getState) => {
  const url = getUrl(getState())
  fetchImages(dispatch, url)
}

export const prevAction = () => (dispatch, getState) => {
  const url = getPrevious(getState())
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
  dispatch(urlChanged(url))
  apiFetch(dispatch, url).then(data => {
    data.results.forEach(img => dispatch(addImage(img)))
    dispatch(fetchedImages(data))
  })
}

// reducers
const defaultState = {
  ids: [],
  text: '',
  thumbStyle: 0,
  fetching: false,
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_SEARCH:
      return defaultState
    case SEARCH_CHANGED:
    case URL_CHANGED:
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
