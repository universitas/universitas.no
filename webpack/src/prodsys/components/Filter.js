import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'

export const Filter = ({
  label,
  isActive,
  title,
  onClick,
  onDoubleClick,
  disabled,
}) => (
  <button
    type="button"
    className={`Filter ${isActive ? 'active' : 'inactive'}`}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    disabled={disabled}
    title={title || label}
  >
    {label}
  </button>
)

const isFilterActive = (attr, value, query) => {
  const query_param = R.prop(attr, query)
  if (R.is(Array, query_param)) {
    if (R.is(Array, value)) return R.isEmpty(R.difference(value, query_param))
    else return R.contains(value, query_param)
  }
  return R.equals(value, query_param)
}

const mapStateToProps = (state, { model, attr, value, toggle }) => {
  const query = modelSelectors(model).getQuery(state)
  const isActive = isFilterActive(attr, value, query)
  const disabled = toggle ? false : isActive
  return { isActive, disabled }
}

const mapDispatchToProps = (dispatch, { model, attr, value, toggle }) => {
  const { filterToggled, filterSet } = modelActions(model)
  const leftClick = toggle ? filterToggled : filterSet
  const onClick = e => dispatch(leftClick(attr, value))
  const onDoubleClick = e => dispatch(filterSet(attr, value))
  return { onClick, onDoubleClick }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
