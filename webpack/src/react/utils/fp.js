import R from 'ramda'

// add or remove item from list
export const arrayToggle = R.pipe(
  R.ifElse(R.contains, R.without, R.union),
  R.sort(R.gt)
)

// add or remove item from object
export const objectToggle = R.ifElse(
  R.propEq,
  (key, val, object) => R.dissoc(key, object),
  R.assoc
)
