// Phone field
import { stringify, phoneFormat } from 'utils/text'

export const EditableField = ({ value, ...args }) => (
  <input
    pattern="(\+\d\d ?)?([0-9] ?){8,}"
    type="phone"
    value={stringify(value)}
    {...args}
  />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{phoneFormat(value)}</span>
)
