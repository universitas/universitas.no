// Image Field
import cx from 'classnames'

export const DetailField = ({ value, className, ...args }) => (
  <div className={cx('image', className)}>
    <img src={value} {...args} />
  </div>
)

export const EditableField = DetailField
