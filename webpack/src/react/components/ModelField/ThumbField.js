// String Field
export const DetailField = ({ value, className, ...args }) => (
  <img className={`${className} thumb`} src={value} {...args} />
)
export const EditableField = DetailField
