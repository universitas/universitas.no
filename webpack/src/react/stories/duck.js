import { combinedToggle } from '../utils/fp'
export const ITEM_ADDED = 'stories/ITEM_ADDED'
export const ITEM_SELECTED = 'stories/ITEM_SELECTED'
export const ITEM_CLONED = 'stories/ITEM_CLONED'
export const ITEM_PATCHED = 'stories/ITEM_PATCHED'
export const FIELD_CHANGED = 'stories/FIELD_CHANGED'
export const ITEMS_FETCHED = 'stories/ITEMS_FETCHED'
export const ITEM_REQUESTED = 'stories/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'stories/ITEMS_REQUESTED'
export const FILTER_TOGGLED = 'stories/FILTER_TOGGLED'
export const FILTER_SET = 'stories/FILTER_SET'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const currentItemLens = lens('currentItem')
const currentItemsLens = lens('currentItems')
const queryLens = lens('query')
const itemsLens = lens('items')
const navigationLens = lens('navigation')
const itemLens = id => R.lensPath(['items', String(id)])

// Selectors
const selectorFromLens = l => R.view(R.compose(lens('stories'), l))

export const getStoryList = selectorFromLens(currentItemsLens)
export const getCurrentStoryId = selectorFromLens(currentItemLens)
export const getQuery = selectorFromLens(queryLens)
export const getNavigation = selectorFromLens(navigationLens)
export const getStory = id => selectorFromLens(itemLens(id))

export const getCurrentStory = state =>
  getStory(getCurrentStoryId(state))(state) || {}

// Action creators
export const storyAdded = data => ({
  type: ITEM_ADDED,
  payload: data,
})
export const storyCloned = id => ({
  type: ITEM_CLONED,
  payload: { id },
})
export const storySelected = id => ({
  type: ITEM_SELECTED,
  payload: { id },
})
export const storyDeSelected = () => ({
  type: ITEM_SELECTED,
  payload: { id: 0 },
})
export const storyPatched = ({ response }) => ({
  type: ITEM_PATCHED,
  payload: { dirty: false, ...response },
})
export const fieldChanged = (id, field, value) => ({
  type: FIELD_CHANGED,
  payload: { id, field, value },
})
export const storyRequested = id => ({
  type: ITEM_REQUESTED,
  payload: { id },
})
export const storiesRequested = url => ({
  type: ITEMS_REQUESTED,
  payload: { url },
})
export const storiesFetched = data => ({
  type: ITEMS_FETCHED,
  payload: data,
})
export const filterToggled = (key, value) => ({
  type: FILTER_TOGGLED,
  payload: { key, value },
})
export const filterSet = (key, value) => ({
  type: FILTER_SET,
  payload: { [key]: value },
})

// reducers
export const initialState = R.pipe(
  R.set(currentItemLens, 0),
  R.set(currentItemsLens, []),
  R.set(queryLens, {
    search: '',
    limit: 25,
    publication_status__in: [3, 4, 5, 6, 7],
    order_by: ['publication_status', '-modified'],
  }),
  R.set(navigationLens, {})
)({})

const offsetFromUrl = R.compose(
  R.defaultTo(0),
  parseInt,
  R.prop(1),
  R.match(/(?:offset=)(\d+)/),
  R.defaultTo('')
)

const getReducer = ({ type, payload }) => {
  switch (type) {
    case ITEMS_FETCHED: {
      const { results, next, previous, count, url } = payload
      const ids = R.pluck('id', results)
      const items = R.zipObj(ids, results)
      return R.compose(
        R.over(itemsLens, R.merge(items)),
        R.set(currentItemsLens, ids),
        R.set(navigationLens, {
          results: results.length,
          last: offsetFromUrl(next) || offsetFromUrl(url) + results.length,
          count,
          next,
          previous,
        })
      )
    }
    case ITEM_PATCHED:
      return R.set(itemLens(payload.id), payload)
    case ITEM_ADDED:
      return R.compose(
        R.over(currentItemsLens, R.union([payload.id])),
        R.set(itemLens(payload.id), payload)
      )
    case FIELD_CHANGED: {
      const { id, field, value } = payload
      const mergeData = { dirty: true, [field]: value }
      const lens = itemLens(id)
      return R.over(lens, R.mergeDeepLeft(mergeData))
      // return R.set(itemLens(id), mergeData)
    }
    case ITEM_SELECTED:
      return R.set(currentItemLens, payload.id)
    case FILTER_SET:
      return R.over(queryLens, R.merge(R.__, payload))
    case FILTER_TOGGLED:
      return R.over(queryLens, combinedToggle(payload.key, payload.value))

    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
