// paramPairs :: (String | Array, String, Object) -> { String : String }
export const paramPairs = (key, value) =>
  R.is(Array, value)
    ? `${key}=${value.map(cleanValues).join(',')}`
    : `${key}=${cleanValues(value)}`

// convert query data to url paramater string
// cleanValues :: Number|String -> String
export const cleanValues = R.pipe(
  String,
  R.trim,
  R.replace(/\s+/g, ' '),
  encodeURIComponent,
)

// Convert api url to primary key
// String -> Number
export const apiUrlToId = R.pipe(
  R.toString,
  R.match(/\d+/g),
  R.map(parseInt),
  R.last,
  R.defaultTo(null),
)

// Emptiness test where the falsy values 0 and false are not empty
// but trythy values {} and [] are empty.
// isEmpty :: Any -> Boolean
export const isEmpty = R.contains(R.__, [{}, undefined, null, [], ''])

// flipify mapObjectIndexed
// ((k, v) -> A) -> Object[k, v] -> Array[A]
const mapObject = fn =>
  R.pipe(R.mapObjIndexed((val, key, _) => fn(key, val)), R.values)

// Build url safe querystring from object mapping.
// queryString :: Obj -> String
export const queryString = R.pipe(
  R.reject(isEmpty),
  mapObject(paramPairs),
  R.join('&'),
)

// Parse query param string to value
// value -> String | Number | Array
export const parseParam = R.cond([
  [R.test(/^[0-9.]+$/), parseFloat],
  [R.test(/,/), R.pipe(R.split(','), R.map(v => parseParam(v)))],
  [R.T, R.identity],
])

// Parse an url or a querystring to get a mapping of query parameters
// String -> {String: String|Number|Array}
export const parseQuery = R.pipe(
  R.tryCatch(
    R.pipe(R.constructN(1, global.URL), url => url.searchParams),
    R.pipe(R.nthArg(1), R.constructN(1, URLSearchParams)),
  ),
  Array.from,
  R.fromPairs,
  R.map(parseParam),
)

// Relative to absolute url (requires global `location`)
export const absoluteURL = url => new URL(url, global.location.href).toString()
