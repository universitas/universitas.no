// String Field
import { stringify } from 'utils/text'

export const EditableField = ({ value, ...args }) => (
  <input type="text" value={stringify(value)} {...args} />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{stringify(value)}</span>
)
