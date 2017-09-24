import * as choice from './ChoiceField'
import * as string from './StringField'
import * as integer from './IntegerField'
import * as date from './DateField'
import * as datetime from './DateTimeField'
import * as text from './TextField'
import * as link from './LinkField'
import * as thumb from './ThumbField'
import * as image from './ImageField'
import * as pdfs from './PdfField'
import { connect } from 'react-redux'
import { modelActions, modelSelectors } from 'ducks/basemodel'

const fields = {
  choice,
  string,
  integer,
  date,
  datetime,
  text,
  link,
  thumb,
  image,
  pdfs,
}

export const Field = ({
  type = 'text',
  editable = false,
  model,
  pk,
  name,
  ...props
}) => {
  const { EditableField, DetailField } = R.propOr(fields.string, type, fields)
  const ModelField = editable ? EditableField : DetailField
  return <ModelField {...props} />
}

const mapStateToProps = (state, { pk, model, name }) => {
  const item = modelSelectors(model).getItem(pk)(state)
  const value = item[name]
  return { value }
}
const mapDispatchToProps = (dispatch, { pk, model, name }) => ({
  onChange: e =>
    dispatch(modelActions(model).fieldChanged(pk, name, e.target.value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Field)
