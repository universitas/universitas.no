const SLICE = 'publicstory'

// Lenses
const sliceLens = R.lensProp(SLICE)
const storyLens = R.lensProp

// Selectors
const selectorFromLens = l => R.view(R.compose(sliceLens, l))
export const getStory = id => selectorFromLens(storyLens(id))

// Actions
export const STORY_REQUESTED = 'newsstory/STORY_REQUESTED'
export const storyRequested = id => ({
  type: STORY_REQUESTED,
  payload: { id },
})
export const STORY_FETCHED = 'newsstory/STORY_FETCHED'
export const storyFetched = data => ({
  type: STORY_FETCHED,
  payload: data,
})

const mergeLeft = R.flip(R.merge)

const getReducer = ({ type, payload, error }) => {
  switch (type) {
    case STORY_REQUESTED:
      return R.over(storyLens(payload.id), mergeLeft({ fetching: true }))
    case STORY_FETCHED:
      return R.over(
        storyLens(payload.id),
        R.pipe(mergeLeft(payload), R.assoc('fetching', true))
      )
    default:
      return R.identity
  }
}

export default (state = {}, action) => getReducer(action)(state)
