// File size field
import { formatFileSize } from 'utils/text'

export const EditableField = ({ value = '', ...args }) => (
  <input type="number" value={value} {...args} />
)

export const DetailField = ({ value, ...args }) => (
  <span {...args}>{formatFileSize(value)}</span>
)
