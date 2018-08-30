// Select Field using AutoSelect
import Select from 'components/Select'
import Debug from 'components/Debug'
import { modelActions, modelSelectors } from 'ducks/basemodel'

import { connect } from 'react-redux'
const mapStateToProps = (state, ownProps) => {
  const { model, value } = urlToProps(ownProps)
  const item = modelSelectors(model).getItem(value)(state)
  return { item, model, value }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const { model, value } = urlToProps(ownProps)
  const requestItem = modelActions(model).itemRequested(value)
  return { requestItem: () => dispatch(requestItem) }
}

const SelectDetail = props => (
  <div style={{ display: 'flex', maxHeight: '30vh' }}>
    <Debug {...props} />
  </div>
)

const pkFromUrl = R.when(R.is(String), R.pipe(R.match(/\d+/g), R.last))

export const DetailField = ({ value, to, options, ...props }) => (
  <span {...props}>
    <Select value={value} model={to} options={options} noneditable />
  </span>
)
export const EditableField = ({
  value,
  to,
  onChange,
  filter,
  options,
  required = true,
  creatable = false,
  ...props
}) => (
  <span {...props}>
    <Select
      filter={filter}
      value={value}
      options={options}
      model={to}
      isClearable={!required}
      onChange={onChange}
      creatable={creatable}
    />
  </span>
)
