// file upload ducks

// ACTIONS
export const ADD = 'fileupload/ADD'
export const uploadAdd = data => ({
  type: ADD,
  payload: { pk: data.md5, ...data },
})

export const UPDATE = 'fileupload/UPDATE'
export const uploadUpdate = (pk, data) => ({
  type: UPDATE,
  payload: { pk, ...data },
})

export const CLOSE = 'fileupload/CANCEL'
export const uploadClose = pk => ({
  type: CLOSE,
  payload: { pk },
})

export const POST = 'fileupload/POST'
export const uploadPost = pk => ({
  type: POST,
  payload: { pk },
})

export const POST_SUCCESS = 'fileupload/POST_SUCCESS'
export const uploadPostSuccess = (pk, { id, artist, category }) => ({
  type: POST_SUCCESS,
  payload: { pk, id, artist, category },
})

export const POST_ERROR = 'fileupload/POST_ERROR'
export const uploadPostError = (pk, error) => ({
  type: POST_ERROR,
  error,
  payload: { pk },
})

export const CHANGE_DUPLICATE = 'fileupload/CHANGE_DUPLICATE'
export const changeDuplicate = (pk, id, choice) => ({
  type: CHANGE_DUPLICATE,
  payload: { pk, id, choice },
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
  thumb: null,
  artist: '',
  description: '',

  fingerprint: null,
  duplicates: null,
  status: 'new',
}

// SELECTORS
const SLICE = 'fileupload'
export const getUploadPKs = R.pipe(
  R.prop(SLICE),
  R.values,
  R.sortBy(R.prop('timestamp')),
  R.pluck('md5'),
  R.reverse
)
export const getUpload = pk => R.view(R.lensPath([SLICE, pk]))

const longerThan = len => R.pipe(R.length, R.lt(len))
const cleanFilename = props => {
  const { mimetype, filename } = props
  const extension = mimetype == 'image/png' ? 'png' : 'jpg'
  const base = R.pipe(R.replace(/[-_ ]+/g, '-'), R.replace(/\..*$/g, ''))(
    filename
  )
  return R.assoc('filename', `${base}.${extension}`, props)
}

const noNulls = R.none(R.propEq('choice', null))

const checkStatus = R.ifElse(
  R.allPass([
    R.propSatisfies(longerThan(5), 'artist'),
    R.propSatisfies(longerThan(5), 'description'),
    R.propSatisfies(val => val !== '0', 'category'),
    R.propSatisfies(R.is(Array), 'duplicates'),
    R.propSatisfies(noNulls, 'duplicates'),
  ]),
  R.assoc('status', 'ready'),
  R.assoc('status', 'invalid')
)

const updateDuplicates = ({ id, choice }) =>
  R.map(R.ifElse(R.propEq('id', id), R.assoc('choice', choice), R.identity))

// REDUCER
const getReducer = ({ type, payload }) => {
  const { pk, ...data } = payload || {}
  const lens = R.lensProp(pk)
  switch (type) {
    case ADD:
      return R.set(lens, R.mergeDeepRight(baseItemState, data))
    case UPDATE:
      return R.over(lens, R.pipe(R.mergeDeepLeft(data), checkStatus))
    case POST:
      return R.over(lens, R.assoc('status', 'uploading'))
    case POST_SUCCESS:
      return R.over(lens, R.mergeDeepLeft({ status: 'uploaded', ...data }))
    case POST_ERROR:
      return R.over(lens, R.assoc('status', 'error'))
    case CHANGE_DUPLICATE:
      return R.over(
        lens,
        R.pipe(
          R.over(R.lensProp('duplicates'), updateDuplicates(data)),
          checkStatus
        )
      )
    case POST_ERROR:
      return R.over(lens, R.assoc('status', 'error'))
    case CLOSE:
      return R.dissoc(pk)
    default:
      return R.identity
  }
}

export const reducer = (state = {}, action) => getReducer(action)(state)
