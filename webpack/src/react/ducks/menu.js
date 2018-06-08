const SLICE = 'menu'
// Lenses
const sliceLens = R.lensProp(SLICE)

// Selectors
const activeKeys = R.pipe(R.filter(R.identity), R.keys)
export const getMenu = R.view(sliceLens)
export const getLanguage = R.pipe(
  getMenu,
  R.prop('language'),
  activeKeys,
  R.ifElse(l => l.length == 1, R.head, R.always(null)),
  R.objOf('language'),
)
export const getFrontpageQuery = R.pipe(
  getMenu,
  R.evolve({ search: R.trim, language: activeKeys, section: activeKeys }),
  R.filter(R.complement(R.isEmpty)),
)

// Actions
export const TOGGLE_SECTION = 'sections/TOGGLE_SECTION'
export const toggleSection = section => ({
  type: TOGGLE_SECTION,
  payload: { section },
})

export const ONLY_SECTION = 'sections/ONLY_SECTION'
export const onlySection = section => ({
  type: ONLY_SECTION,
  payload: { section },
})

export const TOGGLE_LANGUAGE = 'languages/TOGGLE_LANGUAGE'
export const toggleLanguage = language => ({
  type: TOGGLE_LANGUAGE,
  payload: { language },
})

export const ONLY_LANGUAGE = 'languages/ONLY_LANGUAGE'
export const onlyLanguage = language => ({
  type: ONLY_LANGUAGE,
  payload: { language },
})

export const SEARCH_QUERY = 'menu/SEARCH_QUERY'
export const searchQuery = search => ({
  type: SEARCH_QUERY,
  payload: { search },
})

// reducers
export const initialState = {
  section: {},
  language: { nor: true, eng: false },
  search: '',
}

const getReducer = ({ type, payload, error }) => {
  switch (type) {
    case TOGGLE_SECTION:
    case TOGGLE_LANGUAGE:
      return R.over(R.lensPath(R.head(R.toPairs(payload))), R.not)
    case ONLY_SECTION:
      return R.assoc('section', { [payload.section]: true })
    case ONLY_LANGUAGE:
      return R.assoc('language', { [payload.language]: true })
    case SEARCH_QUERY:
      return R.assoc('search', payload.search)
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action = {}) =>
  getReducer(action)(state)
