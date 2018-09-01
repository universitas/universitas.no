import * as choice from './ChoiceField'
import * as select from './SelectField.js'
import * as string from './StringField'
import * as integer from './IntegerField'
import * as date from './DateField'
import * as datetime from './DateTimeField'
import * as text from './TextField'
import * as link from './LinkField'
import * as thumb from './ThumbField'
import * as image from './ImageField'
import * as boolean from './CheckBoxField'
import * as pdfs from './PdfField'
import * as email from './EmailField'
import * as phone from './PhoneField'
import * as count from './CountField'
import * as concat from './ConcatField'
import * as stints from './StintsField'
import * as filesize from './FileSizeField'
import * as cropbox from './CropBoxField.js'
import * as range from './RangeField.js'
import { connect } from 'react-redux'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'
import * as R from 'ramda'

import './modelfield.scss'

const fieldTypes = {
  choice,
  concat,
  count,
  cropbox,
  boolean,
  date,
  datetime,
  email,
  filesize,
  image,
  integer,
  link,
  pdfs,
  phone,
  range,
  select,
  shorttext: text,
  stints,
  string,
  text,
  thumb,
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
    fieldTypes,
  )
  const fieldProps = R.omit(['model', 'pk', 'name'], props)
  const ModelField = editable ? EditableField : DetailField
  return (
    <div className={cx('ModelField', type, { editable })}>
      {R.is(String, label) && <label className={cx('label')}>{label}</label>}
      <ModelField
        className={cx('value')}
        onChange={ev => onChange(ev && ev.target ? ev.target.value : ev)}
        value={value}
        {...fieldProps}
      />
    </div>
  )
}

const mapStateToProps = (state, { pk, model, name }) => {
  const item = modelSelectors(model).getItem(pk)(state) || {}
  const value = item[name]
  // return { value, item }
  return R.contains(name, ['crop_box']) ? { value, item } : { value }
}
const mapDispatchToProps = (dispatch, { pk, model, name }) => ({
  onChange: value => {
    dispatch(modelActions(model).fieldChanged(pk, name, value))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Field)
