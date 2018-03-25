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

// :: int|string -> string
export const phoneFormat = R.pipe(stringify, s => 'tlf: ' + s)

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
export const formatFileSize = (size, digits = 3) => {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const multiple = Math.floor(Math.log10(size) / 3)
  const number = toFixed(digits, size / 10 ** (multiple * 3))
  const unit = units[multiple]
  return unit ? `${number} ${unit}` : 'very bigly large size'
}

// :: utf-8 encoded string -> unicode string
export const utf8Decode = R.tryCatch(
  R.when(R.is(String), R.pipe(escape, decodeURIComponent, R.trim)),
  R.nthArg(1)
)
