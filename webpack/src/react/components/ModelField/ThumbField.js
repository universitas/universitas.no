// Thumb Field
//
import cx from 'classnames'
import Thumb from 'components/Thumb'

export const DetailField = ({ value, className, ...args }) => (
  <Thumb className={cx('thumb', className)} src={value} {...args} />
)

export const EditableField = DetailField
