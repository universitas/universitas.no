import { Field } from 'components/ModelField'
import PhotoStats from './PhotoStats.js'
import Thumb from 'components/Thumb'
import cx from 'classnames'

const ImageData = ({ thumb, onClick, ...props }) => (
  <div className={cx('ImageData', { clickable: onClick })} onClick={onClick}>
    <Thumb src={thumb} title={props.filename} />
    <PhotoStats {...props} />
  </div>
)

export default ImageData
