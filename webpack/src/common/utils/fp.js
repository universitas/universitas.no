// add item to array if not present
// :: a -> [a] -> [a]
export const union = R.useWith(R.union, [R.of])

// remove item from array if present
// :: a -> [a] -> [a]
export const without = R.useWith(R.without, [R.of])

// Add or remove item from list
// :: a -> [a] -> [a]
export const arrayToggle = R.pipe(
  R.cond([
    [R.is(Array), R.symmetricDifference],
    [R.contains, without],
    [R.T, union],
  ]),
  R.sort(R.comparator(R.lt)),
)

// Toggle item from object
// :: k -> v -> {k: v} -> {k: v}
export const objectToggle = R.ifElse(
  R.propEq,
  (key, val, object) => R.dissoc(key, object),
  R.assoc,
)

// Toggle item from nested object
// :: k -> v -> {k: [v]|v} -> {k: [v]|v}
export const combinedToggle = R.curry(
  R.ifElse(
    (key, val, object) => R.is(Array, R.prop(key, object)),
    (key, val, object) =>
      R.assoc(key, arrayToggle(val, R.prop(key, object)), object),
    objectToggle,
  ),
)

// Wrap in array if needed
// :: a|[a] -> [a]
const listOf = R.when(R.complement(R.is(Array)), R.of)

// Partially apply all functions in spec object
// :: {k: (a, b, ...) -> x} -> a|[a] ->  {k: x|(b, ...) -> x }
export const partialMap = R.curry((obj, args) =>
  R.map(
    R.pipe(
      R.curry,
      R.partial(R.__, listOf(args)),
      R.call,
    ),
    obj,
  ),
)
