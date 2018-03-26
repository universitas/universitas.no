// Phone field
import { stringify, phoneFormat } from 'utils/text'

export const EditableField = ({ value, ...args }) => (
  <input type="phone" value={stringify(value)} {...args} />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{phoneFormat(value)}</span>
)
