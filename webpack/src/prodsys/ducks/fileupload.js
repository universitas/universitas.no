import { modelSelectors } from 'ducks/basemodel'
// file upload ducks
const SLICE = 'fileupload'

// ACTIONS

export const CHANGE_DUPLICATE = 'fileupload/CHANGE_DUPLICATE'
export const POST_ERROR = 'fileupload/POST_ERROR'
export const POST_SUCCESS = 'fileupload/POST_SUCCESS'
export const POST = 'fileupload/POST'
export const CLOSE = 'fileupload/CANCEL'
export const UPDATE = 'fileupload/UPDATE'
export const ADD = 'fileupload/ADD'
export const TOGGLE_UPDATE_ALL = 'fileupload/TOGGLE_UPDATE_ALL'

export const toggleUpdateAll = () => ({ type: TOGGLE_UPDATE_ALL })

export const uploadClose = pk => ({ type: CLOSE, payload: { pk } })

export const uploadPost = pk => ({ type: POST, payload: { pk } })

export const uploadAdd = data => ({
  type: ADD,
  payload: { pk: data.md5, ...data },
})

export const uploadUpdate = (pk, data, verify = true) => ({
  type: UPDATE,
  payload: { pk, verify, ...data },
})

export const changeDuplicate = (pk, id, choice) => ({
  type: CHANGE_DUPLICATE,
  payload: { pk, id, choice },
})

export const uploadPostSuccess = (pk, { id, artist, category, filename }) => ({
  type: POST_SUCCESS,
  payload: { pk, id, artist, category, filename },
})

export const uploadPostError = (pk, error) => ({
  type: POST_ERROR,
  error,
  payload: { pk },
})

const baseItemState = {
  category: 1,
  md5: null,
  objectURL: null,
  filename: null,
  height: 0,
  width: 0,
  date: null,
  mimetype: '',
  size: 0,
  small: null,
  description: '',
  fingerprint: null,
  duplicates: null,
  status: 'new',
  story: 0,
}

// lenses
const updateAllLens = R.lensProp('updateAll')
const itemsLens = R.lensProp('items')
const itemLens = pk =>
  R.compose(
    itemsLens,
    R.lensProp(pk),
  )

// SELECTORS
const lensSelector = lens =>
  R.view(
    R.compose(
      R.lensProp(SLICE),
      lens,
    ),
  )

const getUploads = lensSelector(itemsLens)
export const getUpload = R.pipe(
  itemLens,
  lensSelector,
)
export const getUpdateAll = lensSelector(updateAllLens)
export const getUploadPKs = R.pipe(
  getUploads,
  R.values,
  R.sortBy(R.prop('timestamp')),
  R.pluck('md5'),
  R.reverse,
)

const getStories = modelSelectors('stories').getItems
const activeStatus = s => s > 0 && s < 6
const isActive = R.propSatisfies(activeStatus, 'publication_status')
const displayName = (s = '?') =>
  s.length > 40 ? s.substring(0, 34) + ' [...]' : s
const asChoice = s => ({
  value: s.id,
  display_name: displayName(s.working_title),
})
export const getStoryChoices = R.pipe(
  getStories,
  R.values,
  R.filter(isActive),
  R.sortBy(R.prop('working_title')),
  R.map(asChoice),
)

const cleanFilename = props => {
  const { mimetype, filename } = props
  const extension = mimetype == 'image/png' ? 'png' : 'jpg'
  const base = R.pipe(
    R.replace(/[-_ ]+/g, '-'),
    R.replace(/\..*$/g, ''),
  )(filename)
  return R.assoc('filename', `${base}.${extension}`, props)
}

const validate = (validator, message) =>
  R.pipe(R.ifElse(validator, R.always(null), R.always([message])))

const validators = {
  filename: validate(R.test(/.{5,}/), 'filnavnet er for kort'),
  description: validate(R.test(/.{20,}/), 'beskrivelsen er for kort'),
  contributor: validate(Boolean, 'fyll ut dette feltet'),
  category: validate(Boolean, 'fyll ut dette feltet'),
}

const validateUpload = R.converge(R.call, [
  R.pipe(
    R.pick(R.keys(validators)),
    R.evolve(validators),
    R.filter(Boolean),
    R.ifElse(
      R.isEmpty,
      () => R.mergeLeft({ status: 'ready', _error: null }),
      err => R.mergeLeft({ status: 'invalid', _error: err }),
    ),
  ),
  R.identity,
])

const updateDuplicates = ({ id, choice }) =>
  R.map(R.ifElse(R.propEq('id', id), R.assoc('choice', choice), R.identity))

// REDUCER
const getReducer = ({ type, payload = {}, error }) => {
  const { pk, ...data } = payload
  const overItem = R.over(itemLens(pk))
  switch (type) {
    case ADD:
      return R.set(itemLens(pk), R.mergeDeepRight(baseItemState, data))
    case UPDATE: {
      const { verify, ...change } = data
      const updateItem = R.pipe(
        R.mergeDeepLeft(change),
        verify ? validateUpload : R.identity,
      )
      return R.ifElse(
        R.view(updateAllLens),
        R.over(itemsLens, R.map(updateItem)),
        overItem(updateItem),
      )
    }
    case TOGGLE_UPDATE_ALL:
      return R.over(updateAllLens, R.not)
    case POST:
      return overItem(R.assoc('status', 'uploading'))
    case POST_SUCCESS:
      return overItem(R.mergeDeepLeft({ status: 'uploaded', ...data }))
    case POST_ERROR:
      return overItem(R.mergeDeepLeft({ status: 'error', error }))
    case CHANGE_DUPLICATE:
      return overItem(
        R.pipe(
          R.over(R.lensProp('duplicates'), updateDuplicates(data)),
          validateUpload,
        ),
      )
    case CLOSE:
      return R.over(itemsLens, R.dissoc(pk))
    default:
      return R.identity
  }
}

const initialState = { updateAll: false, items: [] }
export const reducer = (state = initialState, action = {}) =>
  getReducer(action)(state)
