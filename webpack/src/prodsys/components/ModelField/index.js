import * as boolean from './CheckBoxField'
import * as choice from './ChoiceField'
import * as concat from './ConcatField'
import * as count from './CountField'
import * as cropbox from './CropBoxField.js'
import * as date from './DateField'
import * as datetime from './DateTimeField'
import * as email from './EmailField'
import * as filesize from './FileSizeField'
import * as image from './ImageField'
import * as integer from './IntegerField'
import * as link from './LinkField'
import * as pdfs from './PdfField'
import * as phone from './PhoneField'
import * as range from './RangeField.js'
import * as select from './SelectField.js'
import * as stints from './StintsField'
import * as string from './StringField'
import * as text from './TextField'
import * as thumb from './ThumbField'
import { connect } from 'react-redux'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'
import * as R from 'ramda'

import './modelfield.scss'

const fieldTypes = {
  boolean,
  choice,
  concat,
  count,
  cropbox,
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

// dumb field
export const Field = ({
  type = 'text',
  editable = false,
  fullwidth = false,
  label,
  onChange,
  value,
  helpText,
  ...props
}) => {
  const { EditableField, DetailField } = R.propOr(
    fieldTypes.string,
    type,
    fieldTypes,
  )
  const fieldProps = R.omit(['model', 'pk'], props)
  const ModelField = editable ? EditableField : DetailField
  return (
    <div
      title={helpText}
      className={cx('ModelField', type, { fullwidth, editable })}
    >
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

const mapStateToProps = (state, { pk, model, name, ...props }) => {
  const item = modelSelectors(model).getItem(pk)(state) || {}
  const value = props.value || item[name]
  return R.contains(name, ['crop_box']) ? { value, item } : { value }
}
const mapDispatchToProps = (dispatch, { pk, model, name, onChange }) => ({
  onChange: value => {
    onChange
      ? onChange(value)
      : dispatch(modelActions(model).fieldChanged(pk, name, value))
  },
})

const ModelField = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Field)
export default ModelField

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1)

// curry model name and field config
export const fieldFactory = (model, fields) => {
  const Field = ({ name, ...props }) => (
    <ModelField
      key={name}
      name={name}
      model={model}
      {...fields[name]}
      {...props}
    />
  )
  Field.displayName = `${capitalize(model)}Field`
  return Field
}
