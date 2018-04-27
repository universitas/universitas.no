import { detailFields as fields } from 'photos/model'
import Thumb from 'components/Thumb'
import { Field } from 'components/ModelField'
import PhotoStats from 'components/PhotoStats'
import cx from 'classnames'

const StaticImageData = ({ thumb, onClick, ...props }) => (
  <div
    className={cx('StaticImageData', { clickable: onClick })}
    onClick={onClick}
  >
    <Thumb src={thumb} title={props.filename} />
    <PhotoStats {...props} />
  </div>
)

export default StaticImageData
