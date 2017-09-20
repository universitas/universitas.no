import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const Filter = ({ label, onClick, isActive, disabled }) => (
  <button
    type="button"
    className={`Filter ${isActive ? 'active' : 'inactive'}`}
    disabled={disabled}
    onClick={onClick}
  >
    {label}
  </button>
)

const isFilterActive = (attr, value, query) => {
  const query_param = R.prop(attr, query)
  return R.type(query_param) === 'Array'
    ? R.contains(value, query_param)
    : R.equals(value, query_param)
}

const mapStateToProps = (state, { model, attr, value, toggle }) => {
  const query = modelSelectors(model).getQuery(state)
  const isActive = isFilterActive(attr, value, query)
  const disabled = toggle ? false : isActive
  return { isActive, disabled }
}

const mapDispatchToProps = (dispatch, { model, attr, value, toggle }) => {
  const { filterToggled, filterSet } = modelActions(model)
  const actionCreator = toggle ? filterToggled : filterSet
  const onClick = e => dispatch(actionCreator(attr, value))
  return { onClick }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
