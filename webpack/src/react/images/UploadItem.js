import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import {
  getUpload,
  uploadUpdate,
  uploadPost,
  uploadClose,
} from 'ducks/fileupload'

import { detailFields as fields } from 'images/model'
import { Field } from 'components/ModelField'
import StaticImageData from './ImageData'
import Duplicate from './Duplicate'

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
  viewImage,
  uploadPost,
  uploadClose,
  uploadUpdate,
  thumb,
  pk,
  status,
  id,
  ...props
}) => (
  <div className="UploadItem">
    <StaticImageData thumb={thumb} {...props} />
    <div className="dynamic">
      <UploadForm
        editable={status != 'uploaded' && status != 'uploading'}
        changeHandler={field => e =>
          uploadUpdate(pk, R.objOf(field, e.target.value))}
        {...props}
      />
    </div>
    <div className="buttons">
      {status == 'ready' && <button onClick={uploadPost}>Last opp</button>}
      {(status == 'ready' || status == 'invalid') && (
        <button onClick={uploadClose}>Avbryt</button>
      )}
      {status == 'uploaded' && <button onClick={uploadClose}>Lukk</button>}
      {id && <button onClick={viewImage(id)}>Vis</button>}
    </div>
    <Duplicates {...props} pk={pk} />
  </div>
)

const Duplicates = ({ duplicates, pk }) =>
  duplicates && duplicates.length ? (
    <div className="Duplicates">
      <small>Bildet er lastet opp fra før</small>
      {R.map(({ id, choice }) => (
        <Duplicate key={id} id={id} choice={choice} pk={pk} />
      ))(duplicates)}
    </div>
  ) : null

const mapStateToProps = (state, { pk }) => getUpload(pk, state)
const mapDispatchToProps = (dispatch, { pk, id }) => ({
  uploadPost: e => dispatch(uploadPost(pk)),
  uploadClose: e => dispatch(uploadClose(pk)),
  uploadUpdate: (pk, data) => dispatch(uploadUpdate(pk, data)),
  viewImage: id => e => {
    dispatch(push(`/images/${id}`))
    dispatch(uploadClose(pk))
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(UploadItem)
