import Select from './Select.js'
import ModelSelect from './ModelSelect.js'
import './Select.scss'
export { Select, ModelSelect }
export default props =>
  props.model ? (
    <ModelSelect {...props} />
  ) : (
    <Select {...props} item={getItem(props)} />
  )

const flattenOptions = options => {
  const retval = []
  for (const option of options) {
    if (option.options) retval.push(...flattenOptions(option.options))
    else retval.push(option)
  }
  return retval
}

const getItem = ({ value = null, options = [] }) => {
  return R.pipe(flattenOptions, R.indexBy(R.prop('value')), R.prop(value))(
    options,
  )
}
