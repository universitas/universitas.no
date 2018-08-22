import cx from 'classnames'
import './PlaceHolder.scss'

const Svg = ({ color = '#6f6ac0' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 130 100"
    color={color}
    height="100%"
    width="100%"
    preserveAspectRatio="none"
  >
    <rect rx="2" ry="2" height="70" width="130" y="0" x="0" />
    <rect rx="2" ry="2" height="10" width="130" y="77" x="0" />
    <rect rx="2" ry="2" height="10" width="100" y="90" x="0" />
  </svg>
)

const PlaceHolder = ({ className, addRef, ...props }) => (
  <div ref={addRef} {...props} className={cx('PlaceHolder', className)}>
    <Svg />
  </div>
)

export default PlaceHolder
