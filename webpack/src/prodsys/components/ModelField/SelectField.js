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

export const DetailField = ({ value, to, ...props }) => (
  <span {...props}>
    <Select value={pkFromUrl(value)} model={to} />
  </span>
)
export const EditableField = ({ value, to, onChange, ...props }) => (
  <span {...props}>
    <Select value={pkFromUrl(value)} model={to} onChange={onChange} />
  </span>
)
