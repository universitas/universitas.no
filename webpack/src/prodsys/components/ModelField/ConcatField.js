// ConcatField

export const DetailField = ({ value, ...args }) => (
  <span {...args}>{R.join(', ', R.map(v => `${v}`, value))}</span>
)
export const EditableField = DetailField
