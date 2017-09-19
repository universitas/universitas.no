// String Field
export const EditableField = ({ value, ...args }) => (
  <input type="text" value={value} {...args} />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{value}</span>
)
