import ReactSelect from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import models from './models'
import styles from './styles.js'
import * as components from './components.js'

class Select extends React.Component {
  constructor(props) {
    super(props)
    const model = models[props.model] || {}
    this.styles = styles
    this.components = {
      ...components,
      ...(model.components || {}),
    }
    this.getOptionValue = ({ value, id }) => value || id
    this.getOptionLabel = ({ label, ...props }) =>
      label || R.join(', ', R.keys(props))
    this.onInputChange = this.onInputChange.bind(this)
    this.state = { isLoading: props.fetching }
    this.onCreateOption = value => {
      const postData = (model.create || R.objOf('value'))(value)
      this.props.create(postData)
      this.props.onChange(value)
    }
  }

  onInputChange(value, { action }) {
    const { debounce = 500, search, filter = {} } = this.props
    this.setState({ inputValue: undefined })
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
    const { fetching, value, item, model, items } = this.props
    if (prevProps.fetching != fetching) this.setState({ isLoading: fetching })
    if (value && !item) {
      const createdItem = R.last(
        R.filter(R.propEq('label', value), R.values(items)),
      )
      if (createdItem) {
        this.props.onChange(this.getOptionValue(createdItem))
      }
    }
  }

  componentDidMount() {
    const { value, item, fetch } = this.props
    if (!fetch) return
    if (value && !item) fetch(value)
  }

  render() {
    const {
      creatable,
      noneditable,
      options,
      item,
      onChange,
      ...props
    } = this.props
    if (noneditable) {
      // for use with ModelField
      return item ? this.getOptionLabel(item) : '–'
    }
    const SelectComponent = creatable ? CreatableSelect : ReactSelect
    return (
      <SelectComponent
        onInputChange={this.onInputChange}
        getOptionLabel={this.getOptionLabel}
        getOptionValue={this.getOptionValue}
        components={this.components}
        options={options}
        styles={this.styles}
        menuIsOpen={undefined}
        isLoading={this.state.isLoading}
        isClearable={true}
        classNamePrefix="react-select"
        placeholder="Velg ..."
        noOptionsMessage={() => 'Ingen treff'}
        loadingMessage={() => 'Laster inn...'}
        onChange={value => onChange(value && this.getOptionValue(value))}
        minMenuHeight={500}
        menuPlacement="auto"
        {...props}
        {...creatableProps}
        onCreateOption={this.onCreateOption}
        value={item}
        className="ReactSelect"
        inputValue={this.state.inputValue}
      />
    )
  }
}

const creatableProps = {
  /* Allow options to be created while the `isLoading` prop is true. Useful to
     prevent the "create new ..." option being displayed while async results are
     still being loaded. */
  allowCreateWhileLoading: false,
  /* Gets the label for the "create new ..." option in the menu. Is given the
     current input value. */
  // formatCreateLabel: string => Node,
  /* Determines whether the "create new ..." option should be displayed based on
     the current input value, select value and options array. */
  // isValidNewOption: (string, ValueType, OptionsType) => boolean,
  isValidNewOption: (string, value, options) => string.length > 4,
  /* Returns the data for the new option when it is created. Used to display the
     value, and is passed to `onChange`. */
  // getNewOptionData: (string, Node) => OptionType,
  getNewOptionData: (value, node) => {
    return { value, label: value }
  },
  /* If provided, this will be called with the input value when a new option is
     created, and `onChange` will **not** be called. Use this when you need more
     control over what happens when new options are created. */
  // onCreateOption?: string => void,
  /* Sets the position of the createOption element in your options list. Defaults to 'last' */
  // createOptionPosition: 'first' | 'last',
  createOptionPosition: 'first',
}

export default Select
