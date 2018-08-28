import ReactAutoSuggest from 'react-autosuggest'
import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel.js'

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
    }
  }
  onSuggestionsFetchRequested({ value }) {}
  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] })
  }
  render() {
    const { value, suggestions } = this.props
    const inputProps = {
      placeholder: 'What ??',
      value,
      onChange: this.onChange,
    }
    return (
      <ReactAutoSuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    )
  }
}

const mapStateToProps = (state, { model }) => ({
  items: modelSelectors(model).getItems(state),
})
const mapDispatchToProps = (dispatch, { model }) => ({
  search: params => dispatch(modelActions(model).itemsRequested(params)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AutoSuggest)
