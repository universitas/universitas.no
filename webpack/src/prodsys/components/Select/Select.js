import ReactSelect, { components } from 'react-select'
import xSvg from 'images/x.svg'
import chevronSvg from 'images/chevron.svg'
import Throbber from 'components/Throbber'
import models from './models'
import { toJson } from 'utils/text'

class Select extends React.Component {
  constructor(props) {
    super(props)
    const model = models[props.model] || {}
    this.components = {
      DropdownIndicator,
      ClearIndicator,
      LoadingIndicator,
      ...(model.components || {}),
    }
    this.getOptionValue = R.prop('id')
    this.getOptionLabel = ({ label, name, filename, display_name }) =>
      label || name || filename || display_name
    this.styles = getStyles()
    this.itemsToOptions = model.itemsToOptions || R.values
    this.onInputChange = this.onInputChange.bind(this)
    this.state = { isLoading: props.fetching }
  }

  onInputChange(value, { action }) {
    const { debounce = 500, search, filter = {} } = this.props
    if (!search) return
    clearTimeout(this.fetchDebounce)
    if (action != 'input-change' || value.length < 3) {
      this.setState({ isLoading: false })
    } else {
      this.setState({ isLoading: true })
      this.fetchDebounce = setTimeout(() => {
        search({ search: value, ...filter })
      }, debounce)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.fetching != prevProps.fetching)
      this.setState({ isLoading: this.props.fetching })
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
        onInputChange={this.onInputChange}
        getOptionLabel={this.getOptionLabel}
        getOptionValue={this.getOptionValue}
        components={this.components}
        options={options}
        styles={this.styles}
        menuIsOpen={undefined}
        isLoading={this.state.isLoading}
        {...props}
        classNamePrefix="react-select"
        isClearable={true}
        placeholder="Velg ..."
        noOptionsMessage={() => 'Ingen treff'}
        loadingMessage={() => 'Laster inn...'}
        onChange={value => onChange(value && value.id)}
        value={items[value] || null}
        className="ReactSelect"
        minMenuHeight={500}
        menuPlacement="auto"
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
const LoadingIndicator = ({ innerProps }) => (
  <span className="react-select__loading-indicator" {...innerProps}>
    <Throbber />
  </span>
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
    // 'menu',
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
  styles['menu'] = R.pick(['top', 'bottom'])
  return styles
}
export default Select
