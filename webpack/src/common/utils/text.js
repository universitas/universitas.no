import { distanceInWordsToNow, format } from 'date-fns'
import norwayLocale from 'date-fns/locale/nb'
import prettyJson from 'json-stringify-pretty-compact'
import FuzzySet from 'fuzzyset'
import Hypher from 'hypher'
import norwegian from 'hyphenation.nb-no'

// captialize
export const capitalize = R.replace(/./, R.toUpper)

// hyphenate text
const hyphenator_no = new Hypher({ ...norwegian, rightmin: 4, leftmin: 4 })

export const hyphenate = text => hyphenator_no.hyphenateText(text, 10)

// pretty JSON
export const toJson = R.tryCatch(prettyJson, (e, data) =>
  JSON.stringify(e, Object.getOwnPropertyNames(e)),
)

// Fuzzy matcher
// :: ([str], number) -> str -> str
export const makeFuzzer = (candidates, cutoff = 0.5) => {
  const fuzzer = FuzzySet(candidates)
  return R.either(
    R.pipe(
      t => fuzzer.get(t) || [],
      R.filter(R.propSatisfies(R.lt(cutoff), '0')),
      R.path([0, 1]),
    ),
    R.identity,
  )
}

// :: string -> string

const NBRS = '\xA0'
const WORDJOINER = '\u2060'
const APOSTROPHE = 'ʼ'

// cleanup some markup
export const cleanText = R.pipe(
  R.replace(/“/g, '«'), // left curly quote
  R.replace(/”/g, '»'), // right curly quote
  R.replace(/\b'\b/g, APOSTROPHE), // ascii apostrophe
  R.replace(/\u0092/g, APOSTROPHE), // win 1251 encoding
  R.replace(/\B"(.*?)"\B/gu, '«$1»'), // straight quotes
  R.replace(/--/g, '–'), // en-dash
  R.replace(/(^|[.:?!] +)[-–] ?\b/gmu, `$1–${WORDJOINER}${NBRS}`),
  R.replace(/\r/g, ''), // no carriage returns
  R.replace(/\n{3,}/g, '\n\n'), // multi newlines
)

// :: * -> string
export const stringify = R.cond([
  [R.is(String), R.identity],
  [R.isNil, R.always('')],
  [R.T, R.toString],
])

// like unix `tr` tranlate program
// :: str -> str -> str -> str
export const tr = R.curry((a, b, text) => {
  const trans = R.zipObj(R.split('', a), R.split('', b))
  return R.pipe(R.map(l => trans[l] || l), R.join(''))(text)
})

// :: string -> string
export const slugify = R.pipe(
  R.toLower,
  R.replace(/['"]/g, ''),
  tr('æåàáäâèéëêìíïîòóøöôùúüûñç', 'aaaaaaeeeeiiiiooooouuuunc'),
  R.replace(/[^a-z0-9]+/g, ' '),
  R.trim,
  R.replace(/ +/g, '-'),
)

// :: int|string -> string
export const phoneFormat = R.pipe(
  stringify,
  R.trim,
  R.ifElse(Boolean, R.identity, R.always('–')),
  R.replace(/ /g, ''),
  R.replace(/(\+\d\d)?(\d{3})(\d{2})(\d{3})$/, '$1 $2 $3 $4'),
)

// :: string|Date -> string
export const formatDate = (
  value,
  dateformat = 'dddd DD. MMM YYYY',
  locale = norwayLocale,
  relative = false,
) =>
  relative
    ? distanceInWordsToNow(new Date(value), { addSuffix: true, locale })
    : format(new Date(value), dateformat, { locale })

// :: number -> string
const toFixed = R.curryN(2, (digits, number) => number.toPrecision(digits))

// :: number -> string
export const formatFileSize = (size = 0, digits = 3) => {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const multiple = size ? Math.floor(Math.log10(size) / 3) : 0
  const number = multiple ? toFixed(digits, size / 10 ** (multiple * 3)) : size
  const unit = units[multiple]
  const nbrspace = '\xA0'
  return unit ? `${number}${nbrspace}${unit}` : 'very bigly large size'
}

// Exif utility. Text fields are often encoded in utf8.
// :: utf-8 encoded string -> unicode string
export const utf8Decode = R.when(
  R.is(String),
  R.pipe(
    R.replace(/\xc5\x92/g, 'å'), // workaround unknown encoding
    R.replace(/\xc2\xbf/g, 'ø'), // workaround unknown encoding
    R.tryCatch(R.pipe(escape, decodeURIComponent), R.nthArg(1)),
    R.trim,
  ),
)

// simple text hasher
// :: string -> number
export const hashText = text => {
  let hash = 0
  let i = text.length
  while (i--) hash = ((hash << 5) - hash + text.charCodeAt(i)) << 0
  return hash
}
