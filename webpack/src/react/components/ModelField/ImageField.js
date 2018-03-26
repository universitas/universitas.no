// Image Field
import cx from 'classnames'

export const DetailField = ({ value, className, ...args }) => (
  <div className={cx('image', className)}>
    <div>
      <img src={value} {...args} />
    </div>{' '}
  </div>
)

export const EditableField = DetailField
