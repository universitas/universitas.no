import React from 'react'
import cx from 'classnames'
import 'styles/thumb.scss'

const Thumb = ({ className, ...props }) => (
  <div className={cx('Thumb', className)}>
    <img {...props} />
  </div>
)
export default Thumb
