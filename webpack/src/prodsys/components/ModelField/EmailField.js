// Email Field
import { stringify } from 'utils/text'
import { mailTo } from 'utils/phonemail'

export const EditableField = ({ value, ...args }) => (
  <input
    type="email"
    value={stringify(value)}
    {...args}
    title={JSON.stringify(args, null, 2)}
  />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{mailTo(value)}</span>
)
