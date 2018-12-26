import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { Field } from 'components/ModelField'
import { fields as photoFields } from 'components/photos/model.js'
import {
  uploadUpdate,
  getUpload,
  getUpdateAll,
  getStoryChoices,
} from 'ducks/fileupload'

const story = {
  type: 'select',
  required: false,
  label: 'Artikkel',
  help_text: 'velg artikkel',
  to: 'stories',
}

const fieldNames = [
  'filename',
  'category',
  'contributor',
  'story',
  'description',
]
const formFields = R.pick(fieldNames, { ...photoFields, story })

const FormField = ({ name, value, errors, onChange, editable }) => {
  return (
    <Field
      value={value}
      onChange={onChange}
      editable={true}
      errors={errors}
      {...formFields[name]}
    />
  )
}
const mapStateToProps = (state, { pk, name }) => {
  const item = getUpload(pk)(state)
  const value = item[name]
  const errors = R.path(['_error', name], item)
  return { value, errors }
}
const mapDispatchToProps = (dispatch, { pk, name }) => ({
  onChange: value => dispatch(uploadUpdate(pk, { [name]: value })),
})
const UploadField = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormField)

const UploadForm = ({ pk }) => {
  return (
    <form className="UploadForm">
      {R.map(
        name => (
          <UploadField pk={pk} key={name} name={name} />
        ),
        fieldNames,
      )}
    </form>
  )
}
export default UploadForm
