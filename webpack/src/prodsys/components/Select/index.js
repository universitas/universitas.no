import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel.js'
import Select from './Select.js'
import './Select.scss'

export { Select } // unconnected

const specFilter = R.ifElse(
  R.either(R.not, R.isEmpty),
  R.always(R.identity),
  R.pipe(R.toPairs, R.map(R.apply(R.propEq)), R.allPass, R.filter),
)

const mapStateToProps = (state, { model, filter }) => {
  const { getItems, getFetching } = modelSelectors(model)
  const items = getItems(state)
  return {
    items: specFilter(filter)(items),
    fetching: getFetching(state),
  }
}
const mapDispatchToProps = (dispatch, { model }) => ({
  search: params => dispatch(modelActions(model).itemsRequested(params, true)),
  fetch: id => dispatch(modelActions(model).itemRequested(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Select)
