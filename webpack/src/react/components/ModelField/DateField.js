// Date Field
import { distanceInWordsToNow, format } from 'date-fns'
import norwayLocale from 'date-fns/locale/nb'

const LOCALE = norwayLocale
const DATEFORMAT = 'ddd DD. MMM YYYY'

const formatDate = (
  value,
  dateformat = DATEFORMAT,
  locale = LOCALE,
  relative = false
) =>
  relative
    ? distanceInWordsToNow(new Date(value), { addSuffix: true, locale })
    : format(new Date(value), dateformat, { locale })

export const EditableField = ({ value, ...args }) => (
  <input type="date" value={value} {...args} />
)

export const DetailField = ({
  value,
  dateformat,
  locale,
  relative,
  ...args
}) => <span {...args}>{formatDate(value, dateformat, locale, relative)}</span>
