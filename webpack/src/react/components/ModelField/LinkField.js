// Link Field

const LABEL = 'lenke'

export const EditableField = ({ value, ...args }) => (
  <input type="url" value={value} {...args} />
)

export const DetailField = ({ value, label = LABEL, ...args }) => (
  <span {...args}><a href={value}>{label || value}</a></span>
)
