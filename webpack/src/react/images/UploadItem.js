import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import {
  getUpload,
  uploadUpdate,
  uploadPost,
  uploadClose,
} from 'ducks/fileupload'
import { formatDate, formatFileSize } from 'utils/text'

import { detailFields as fields } from 'images/model'
import Thumb from 'components/Thumb'
import { Field } from 'components/ModelField'

const JSONData = data => (
  <pre style={{ maxWidth: '80vw', fontSize: '0.8em' }}>
    {JSON.stringify(data, null, 2)}
  </pre>
)

const PhotoStats = ({ mimetype, width, height, size, date }) => (
  <div className="PhotoStats">
    <div className="stat">{mimetype}</div>
    <div className="stat">
      {width}×{height}
    </div>
    <div className="stat">{formatFileSize(size)}</div>
    <div className="stat">{formatDate(date)}</div>
  </div>
)

const UploadForm = ({ editable, changeHandler, ...props }) => (
  <form className="UploadForm">
    {R.map(
      key => (
        <Field
          key={key}
          value={props[key]}
          onChange={changeHandler(key)}
          {...fields[key]}
          editable={editable}
        />
      ),
      ['filename', 'artist', 'category', 'description']
    )}
  </form>
)

const UploadItem = ({
  pk,
  uploadPost,
  uploadClose,
  uploadUpdate,
  thumb,
  status,
  viewImage,
  id,
  ...props
}) => (
  <div className="UploadItem">
    <div className="static">
      <Thumb src={thumb} title={pk} />
      <PhotoStats {...props} />
    </div>
    <div className="dynamic">
      <UploadForm
        editable={status != 'uploaded' && status != 'uploading'}
        changeHandler={field => e =>
          uploadUpdate(pk, R.objOf(field, e.target.value))}
        {...props}
      />
    </div>
    <div className="buttons">
      {status == 'ready' && <button onClick={uploadPost}>Post</button>}
      {(status == 'ready' || status == 'invalid') && (
        <button onClick={uploadClose}>Cancel</button>
      )}
      {status == 'uploaded' && <button onClick={uploadClose}>Ok</button>}
      {id && <button onClick={viewImage(id)}>View</button>}
      <span title={JSON.stringify(props, null, 2)}>{status}</span>
    </div>
  </div>
)

const mapStateToProps = (state, { pk }) => getUpload(pk, state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  uploadPost: e => dispatch(uploadPost(pk)),
  uploadClose: e => dispatch(uploadClose(pk)),
  uploadUpdate: (pk, data) => dispatch(uploadUpdate(pk, data)),
  viewImage: id => e => {
    dispatch(push(`/images/${id}`))
    dispatch(uploadClose(pk))
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(UploadItem)
