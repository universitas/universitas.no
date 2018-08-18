// Count Field

export const DetailField = ({ value, ...args }) => (
  <span {...args}>{value.length}</span>
)
export const EditableField = DetailField
