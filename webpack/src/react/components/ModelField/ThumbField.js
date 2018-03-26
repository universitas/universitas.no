import cx from 'classnames'
// Thumb Field
export const DetailField = ({ value, className, ...args }) => (
  <div className={cx('thumb', className)}>
    <img src={value} {...args} />
  </div>
)
export const EditableField = DetailField
