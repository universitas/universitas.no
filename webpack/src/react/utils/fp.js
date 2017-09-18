// :: a -> [a] -> [a] -- ( add item to array if not present )
export const union = R.useWith(R.union, [R.of])

// :: a -> [a] -> [a] -- ( remove item from array if present )
export const without = R.useWith(R.without, [R.of])

// :: a -> [a] -> [a] -- (Add or remove item from list)
export const arrayToggle = R.pipe(
  R.ifElse(R.contains, without, union),
  R.sort(R.gt)
)

// :: k -> v -> {k: v} -> {k: v} -- (Toggle item from object)
export const objectToggle = R.ifElse(
  R.propEq,
  (key, val, object) => R.dissoc(key, object),
  R.assoc
)

// :: k -> v -> {k: [v]|v} -> {k: [v]|v} -- (Toggle item from nested object)
export const combinedToggle = R.curry(
  R.ifElse(
    (key, val, object) => R.equals('Array', R.type(R.prop(key, object))),
    (key, val, object) =>
      R.assoc(key, arrayToggle(val, R.prop(key, object)), object),
    objectToggle
  )
)

// :: a|[a] -> [a] -- Wrap in array if needed
const listOf = R.ifElse(R.is(Array), R.identity, R.of)

// :: {k: (a, b, ...) -> x} -> a|[a] ->  {k: x|(b, ...) -> x } -- (Partially apply all functions in object)
export const partialMap = R.curry((obj, args) =>
  R.map(R.pipe(R.curry, R.partial(R.__, listOf(args)), R.call), obj)
)
