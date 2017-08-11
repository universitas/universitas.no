import R from 'ramda'
import { format } from 'date-fns'
import norwayLocale from 'date-fns/locale/nb'

// human readable date format
export const formatDate = value =>
  format(new Date(value), 'ddd DD. MMM YYYY', { locale: norwayLocale })

// display name from list of choices
export const getDisplayName = (choices, value) =>
  R.compose(
    R.propOr(value, 'display_name'),
    R.find(R.propEq('value', String(value)))
  )(choices)

// fields with defaults
export const cleanFields = ({
  key = 'key',
  label,
  type = 'string',
  editable = false,
  choices = [],
}) => ({
  key,
  label: label || R.replace(/_/g, ' ', key),
  type,
  editable,
  choices,
})

export const detailFieldFilter = R.filter(R.propEq('detail', false))
export const listFieldFilter = R.filter(R.propEq('list', false))
