// Integer field
export const DetailField = ({ value, editable, ...args }) => (
  <span {...args}>{value}</span>
)

export const EditableField = ({ value, editable, ...args }) => (
  <input value={value} {...args} type="number" />
)
