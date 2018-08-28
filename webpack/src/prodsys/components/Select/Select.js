import ReactSelect, { components } from 'react-select'
import xSvg from 'images/x.svg'
import chevronSvg from 'images/chevron.svg'
import models from './models'

class Select extends React.Component {
  constructor(props) {
    super(props)
    const model = models[props.model] || {}
    this.components = {
      DropdownIndicator,
      ClearIndicator,
      ...(model.components || {}),
    }
    this.getOptionValue = R.prop('id')
    this.getOptionLabel = ({ label, name, filename }) =>
      label || name || filename
    this.styles = getStyles()
    this.itemsToOptions = model.itemsToOptions || R.values
  }

  componentDidMount() {
    const { value, items, fetch } = this.props
    const item = items[value]
    if (value && !item) fetch(value)
  }

  render() {
    const { value, items, onChange, ...props } = this.props
    const options = this.itemsToOptions(items)
    return (
      <ReactSelect
        getOptionLabel={this.getOptionLabel}
        getOptionValue={this.getOptionValue}
        components={this.components}
        options={options}
        styles={this.styles}
        menuIsOpen={undefined}
        {...props}
        classNamePrefix="react-select"
        isClearable={true}
        placeholder="Velg ..."
        noOptionsMessage={() => 'Ingen treff'}
        loadingMessage={() => 'Laster inn...'}
        onChange={value => onChange(value && value.id)}
        value={items[value]}
      />
    )
  }
}

const DropdownIndicator = ({ innerProps }) => (
  <img className="react-select__indicator" src={chevronSvg} {...innerProps} />
)
const ClearIndicator = ({ innerProps }) => (
  <img className="react-select__indicator" src={xSvg} {...innerProps} />
)
const getStyles = () => {
  const styleKeys = [
    'container' /* main component */,
    // MAIN INPUT
    'control' /* main input */,
    'valueContainer' /* selected value */,
    'input',
    'singleValue',
    // 'multiValue',
    // 'multiValueLabel',
    // 'multiValueRemove',
    'placeholder',
    // MENU
    'menu',
    'menuList',
    'option',
    'group',
    'groupHeading',
    // 'loadingMessage',
    // 'noOptionsMessage',
    // INDICATORS
    'indicatorsContainer',
    'indicatorSeparator',
    'dropdownIndicator',
    // 'loadingIndicator',
    'clearIndicator',
  ]

  const styles = {}
  for (const key of styleKeys) styles[key] = () => ({})
  return styles
}
export default Select
