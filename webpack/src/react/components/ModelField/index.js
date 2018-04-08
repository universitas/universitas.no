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
import * as email from './EmailField'
import * as phone from './PhoneField'
import * as stints from './StintsField'
import { connect } from 'react-redux'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'
import * as R from 'ramda'

import './modelfield.scss'

const fieldTypes = {
  choice,
  date,
  datetime,
  email,
  image,
  integer,
  link,
  pdfs,
  phone,
  stints,
  string,
  text,
  thumb,
  shorttext: text,
}
export const fieldNames = R.keys(fieldTypes)

export const Field = ({
  type = 'text',
  editable = false,
  label,
  onChange,
  value,
  ...props
}) => {
  const { EditableField, DetailField } = R.propOr(
    fieldTypes.string,
    type,
    fieldTypes
  )
  const fieldProps = R.omit(['model', 'pk', 'name'], props)
  const ModelField = editable ? EditableField : DetailField
  return (
    <div className={cx('ModelField', type)}>
      {R.is(String, label) && <label className={cx('label')}>{label}</label>}
      <ModelField
        className={cx('value')}
        onChange={onChange}
        value={value}
        {...fieldProps}
      />
    </div>
  )
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
