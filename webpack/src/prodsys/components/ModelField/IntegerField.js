// Integer field
export const DetailField = ({ value, editable, ...args }) => (
  <span {...args}>{value}</span>
)

export const EditableField = ({ value, editable, onChange, ...args }) => (
  <input value={value} onChange={onChange} {...args} type="number" />
)
