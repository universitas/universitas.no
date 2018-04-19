import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import Tool from 'components/Tool'
import { Field } from 'components/ModelField'
import { detailFields as fields } from 'images/model'
import { uploadUpdate, getUpload } from 'ducks/fileupload'

const UploadForm = ({ changeHandler, status, ...props }) => (
  <form className="UploadForm">
    {R.map(
      key => (
        <Field
          key={key}
          value={props[key]}
          onChange={changeHandler(key)}
          {...fields[key]}
          editable={status != 'uploaded' && status != 'uploading'}
        />
      ),
      ['filename', 'artist', 'category', 'description']
    )}
  </form>
)

const mapStateToProps = (state, { pk }) => getUpload(pk, state)
const mapDispatchToProps = (dispatch, { pk, id }) => ({
  changeHandler: fieldName => e =>
    dispatch(uploadUpdate(pk, R.objOf(fieldName, e.target.value))),
})
export default connect(mapStateToProps, mapDispatchToProps)(UploadForm)
