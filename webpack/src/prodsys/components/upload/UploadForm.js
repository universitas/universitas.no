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

const UploadForm = ({ changeHandler, status, storyChoices, ...props }) => {
  const fields = {
    story: {
      type: 'choice',
      required: false,
      label: 'Artikkel',
      help_text: 'velg artikkel',
      choices: storyChoices,
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
        ['filename', 'artist', 'category', 'story', 'description'],
      )}
    </form>
  )
}

const mapStateToProps = (state, { pk }) => ({
  ...getUpload(pk)(state),
  storyChoices: [{ display_name: '–', value: '0' }, ...getStoryChoices(state)],
  single: R.not(getUpdateAll(state)),
})
const mergeProps = ({ single, ...props }, { uploadUpdate }, { pk }) => ({
  changeHandler: fieldName => e =>
    uploadUpdate(pk, R.objOf(fieldName, e.target.value), single, true),
  ...props,
})
export default connect(mapStateToProps, { uploadUpdate }, mergeProps)(
  UploadForm,
)
