import cx from 'classnames'
import './Thumb.scss'

const Thumb = ({ className, ...props }) => (
  <div className={cx('Thumb', className)}>
    <img {...props} />
  </div>
)
export default Thumb
