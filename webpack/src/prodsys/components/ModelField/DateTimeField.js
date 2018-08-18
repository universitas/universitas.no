// DateTime Field
import { distanceInWordsToNow, format } from 'date-fns'
import norwayLocale from 'date-fns/locale/nb'

const LOCALE = norwayLocale
const TIMEFORMAT = 'HH:mm ddd DD. MMM YYYY'

const formatDateTime = (
  value,
  timeformat = TIMEFORMAT,
  locale = LOCALE,
  relative = false,
) =>
  relative
    ? distanceInWordsToNow(new Date(value), { addSuffix: true, locale })
    : format(new Date(value), timeformat, { locale })

export const EditableField = ({ value, ...args }) => (
  <input type="datetime-local" value={value} {...args} />
)

export const DetailField = ({
  value,
  timeformat,
  locale,
  relative,
  ...args
}) => (
  <span {...args}>{formatDateTime(value, timeformat, locale, relative)}</span>
)
