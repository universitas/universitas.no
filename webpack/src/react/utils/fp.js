import R from 'ramda'

const listifyFirstArgument = R.useWith(R.__, [v => [v]])
const without = listifyFirstArgument(R.without)
const union = listifyFirstArgument(R.union)

// Add or remove item from list
// (value, array) => array
export const arrayToggle = R.pipe(
  R.ifElse(R.contains, without, union),
  R.sort(R.gt)
)

// Add or remove item from object
// (key, val, object) => object
export const objectToggle = R.ifElse(
  R.propEq,
  (key, val, object) => R.dissoc(key, object),
  R.assoc
)

// Toggle stuff
// (key, val, object) => object
export const combinedToggle = R.curry(
  R.ifElse(
    (key, val, object) => R.equals('Array', R.type(R.prop(key, object))),
    (key, val, object) =>
      R.assoc(key, arrayToggle(val, R.prop(key, object)), object),
    objectToggle
  )
)
