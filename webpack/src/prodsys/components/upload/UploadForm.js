import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { Tool } from 'components/tool'
import { Field } from 'components/ModelField'
import { fields as detailFields } from 'components/photos/model.js'
import {
  uploadUpdate,
  getUpload,
  getUpdateAll,
  getStoryChoices,
} from 'ducks/fileupload'

const UploadForm = ({ changeHandler, status, ...props }) => {
  const fields = {
    story: {
      type: 'select',
      required: false,
      label: 'Artikkel',
      help_text: 'velg artikkel',
      to: 'stories',
    },
    ...detailFields,
  }
  return (
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
        ['filename', 'category', 'contributor', 'story', 'description'],
      )}
    </form>
  )
}

const mapStateToProps = (state, { pk }) => ({
  ...getUpload(pk)(state),
  single: R.not(getUpdateAll(state)),
})
const mergeProps = ({ single, ...props }, { uploadUpdate }, { pk }) => ({
  changeHandler: fieldName => value =>
    uploadUpdate(pk, R.objOf(fieldName, value), single, true),
  ...props,
})
export default connect(mapStateToProps, { uploadUpdate }, mergeProps)(
  UploadForm,
)
