// String Field
import { stringify } from 'utils/text'

export const EditableField = ({ value, ...args }) => (
  <input type="email" value={stringify(value)} {...args} />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}><a href={'mailto:' + value}>{stringify(value)}</a></span>
)
