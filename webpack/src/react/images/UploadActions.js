import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import Tool from 'components/Tool'
import cx from 'classnames'
import {
  getUpload,
  uploadUpdate,
  uploadPost,
  uploadClose,
} from 'ducks/fileupload'

// new, ready, invalid, uploaded, uploading, error
//

const ButtonA = ({ uploadPost, viewImage, status, id }) => {
  return {
    new: <Tool icon="Loop" label="sjekker" className="loading" />,
    uploading: <Tool icon="Loop" label="vent" className="loading" />,
    ready: (
      <Tool
        label="fortsett"
        className="ready"
        icon="Forward"
        onClick={uploadPost}
      />
    ),
    invalid: <Tool label="fortsett" icon="Forward" disabled />,
    error: <Tool label="feil" icon="Block" className="error" />,
    uploaded: (
      <Tool label="vis" className="ready" icon="Eye" onClick={viewImage(id)} />
    ),
  }[status]
}

const ButtonB = ({ uploadClose, status }) =>
  status == 'uploaded' ? (
    <Tool label="ok" icon="Close" onClick={uploadClose} />
  ) : (
    <Tool label="avbryt" className="warn" icon="Close" onClick={uploadClose} />
  )
const UploadActions = props => (
  <div className="UploadActions">
    <ButtonA {...props} />
    <ButtonB {...props} />
  </div>
)

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
export default connect(mapStateToProps, mapDispatchToProps)(UploadActions)
