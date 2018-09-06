import { distanceInWordsToNow, format } from 'date-fns'
import norwayLocale from 'date-fns/locale/nb'

// human readable date format
export const formatDate = (value, formatString = 'ddd DD. MMM YYYY') =>
  format(new Date(value), formatString, { locale: norwayLocale })

export const timestamp = value => format(new Date(value), 'HH:mm:ss')

export const relativeDateTime = value =>
  distanceInWordsToNow(new Date(value), {
    addSuffix: true,
    locale: norwayLocale,
  })

export const formatDateTime = value =>
  format(new Date(value), 'HH:mm ddd DD. MMM', { locale: norwayLocale })

// display name from list of choices
export const getDisplayName = (choices, value) =>
  R.compose(
    R.propOr(value, 'display_name'),
    R.find(R.propEq('value', String(value))),
  )(choices)

// fields with defaults
export const cleanFields = ({
  key = 'key',
  label,
  type = 'string',
  editable = false,
  ...args
}) => ({
  key,
  label: label || R.replace(/_/g, ' ', key),
  type,
  editable,
  ...args,
})

export const detailFieldFilter = R.filter(
  R.complement(R.propEq('detail', false)),
)
export const listFieldFilter = R.filter(R.complement(R.propEq('list', false)))
