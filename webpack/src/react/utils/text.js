import { distanceInWordsToNow, format } from 'date-fns'
import norwayLocale from 'date-fns/locale/nb'

export const cleanup = text => {
  return text
    .replace(/^(@\S+:)/gm, s => s.toLowerCase())
    .replace(/^ *(@\S+:) *\b/gm, '$1 ')
    .replace(/^@t: */gm, '@txt: ')
    .replace(/[«"]([^"»«]*)"/g, '«$1»')
    .replace(/"/g, '«')
    .replace(/--/g, '–')
    .replace(/^[-–] *\b/gm, '– ')
    .replace(/^@text:/gm, '@txt:')
    .replace(/\n+@m$/gm, '\n\n@mt: ')
    .replace(/^./gm, s => s.toUpperCase())
}

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

// slugify
export const slugify = R.pipe(
  R.toLower,
  R.replace(/'"-_/g, ''),
  tr('æåàáäâèéëêìíïîòóøöôùúüûñç', 'aaaaaaeeeeiiiiooooouuuunc'),
  R.replace(/[^a-z0-9]+/g, ' '),
  R.trim,
  R.replace(/ +/g, '-')
)

// :: int|string -> string
export const phoneFormat = R.pipe(
  stringify,
  R.trim,
  R.ifElse(Boolean, R.identity, R.always('–')),
  R.replace(/ /g, ''),
  R.replace(/(\+\d\d)?(\d{3})(\d{2})(\d{3})$/, '$1 $2 $3 $4')
)

// :: string|Date -> string
export const formatDate = (
  value,
  dateformat = 'ddd DD. MMM YYYY',
  locale = norwayLocale,
  relative = false
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

// :: utf-8 encoded string -> unicode string
export const utf8Decode = R.when(
  R.is(String),
  R.pipe(
    R.replace(/\xc5\x92/g, 'å'), // unknown encoding
    R.replace(/\xc2\xbf/g, 'ø'), // unknown encoding
    R.tryCatch(R.pipe(escape, decodeURIComponent), R.nthArg(1)),
    R.trim
  )
)
