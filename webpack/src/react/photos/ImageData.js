import { formatDate, formatFileSize } from 'utils/text'
import { detailFields as fields } from 'photos/model'
import Thumb from 'components/Thumb'
import { Field } from 'components/ModelField'
import cx from 'classnames'

const JSONData = data => (
  <pre style={{ maxWidth: '80vw', fontSize: '0.8em' }}>
    {JSON.stringify(data, null, 2)}
  </pre>
)

const PhotoStats = props => {
  const { mimetype, width, height, filesize, created } = props
  return (
    <div className="PhotoStats" title={JSON.stringify(props, null, 2)}>
      <div className="stat">{mimetype}</div>

      <div className="stat">
        {width}×{height}
      </div>
      <div className="stat">{formatFileSize(filesize)}</div>
      <div className="stat">
        {formatDate(created, 'HH:mm – dddd DD. MMM YYYY')}
      </div>
    </div>
  )
}
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
