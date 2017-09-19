// Text Field
export const DetailField = ({ value, ...args }) => <div {...args}>{value}</div>
export const EditableField = ({ value, ...args }) => (
  <textarea value={value} {...args} />
)
