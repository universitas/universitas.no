import { formatDate, formatFileSize } from 'utils/text'
import { detailFields as fields } from 'images/model'
import Thumb from 'components/Thumb'
import { Field } from 'components/ModelField'

const JSONData = data => (
  <pre style={{ maxWidth: '80vw', fontSize: '0.8em' }}>
    {JSON.stringify(data, null, 2)}
  </pre>
)

const PhotoStats = props => {
  const { mimetype, width, height, size, date } = props
  return (
    <div className="PhotoStats" title={JSON.stringify(props, null, 2)}>
      <div className="stat">{mimetype}</div>

      <div className="stat">
        {width}×{height}
      </div>
      <div className="stat">{formatFileSize(size)}</div>
      <div className="stat">
        {formatDate(date, 'HH:mm – dddd DD. MMM YYYY')}
      </div>
    </div>
  )
}
const StaticImageData = ({ thumb, ...props }) => (
  <div className="static">
    <Thumb src={thumb} title={props.filename} />
    <PhotoStats {...props} />
  </div>
)

export default StaticImageData
