import cx from 'classnames'
// Thumb Field
export const DetailField = ({ value, className, ...args }) => (
  <img className={cx(className, 'thumb')} src={value} {...args} />
)
export const EditableField = DetailField
