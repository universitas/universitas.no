import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import cx from 'classnames'
import {
  getUpload,
  uploadUpdate,
  uploadPost,
  uploadClose,
} from 'ducks/fileupload'
import { toRoute } from 'prodsys/ducks/router'

// new, ready, invalid, uploaded, uploading, error
//

const ButtonA = ({ uploadPost, viewImage, status, id }) => {
  return {
    new: <Tool icon="Loop" label="sjekker" className="spinning" />,
    uploading: <Tool icon="Loop" label="vent" className="spinning" />,
    ready: (
      <Tool
        label="fortsett"
        className="ready"
        icon="Forward"
        onClick={uploadPost}
      />
    ),
    invalid: (
      <Tool
        label="fortsett"
        icon="Forward"
        title="fyll ut alle feltene"
        disabled
      />
    ),
    error: <Tool label="feil" icon="Block" className="error" />,
    uploaded: (
      <Tool label="vis" className="ready" icon="Eye" onClick={viewImage(id)} />
    ),
  }[status]
}

const ButtonB = ({ uploadClose, status }) =>
  status == 'uploaded' ? (
    <Tool label="lukk" icon="Done" onClick={uploadClose} />
  ) : (
    <Tool label="avbryt" className="warn" icon="Close" onClick={uploadClose} />
  )
const UploadActions = props => (
  <div className="Actions">
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
    dispatch(toRoute({ model: 'photos', pk: id }))
    dispatch(uploadClose(pk))
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(UploadActions)
