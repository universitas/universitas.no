// Thumb Field
//
import cx from 'classnames'
import Thumb from 'components/Thumb'

export const DetailField = ({ value, fallback, className, ...args }) => (
  <Thumb className={cx('thumb', className)} src={value || fallback} {...args} />
)

export const EditableField = DetailField
