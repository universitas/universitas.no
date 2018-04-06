// Date Field
import { formatDate } from 'utils/text'

export const EditableField = ({ value = '', ...args }) => (
  <input type="date" value={value} {...args} />
)

export const DetailField = ({
  value,
  dateformat,
  locale,
  relative,
  ...args
}) => <span {...args}>{formatDate(value, dateformat, locale, relative)}</span>
