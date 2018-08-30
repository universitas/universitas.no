import Select from './Select.js'
import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel.js'
import models from './models'

const specFilter = R.ifElse(
  R.either(R.not, R.isEmpty),
  R.always(R.identity),
  R.pipe(R.toPairs, R.map(R.apply(R.propEq)), R.allPass, R.filter),
)

const mapStateToProps = (state, { model, filter, value }) => {
  const { getItems, getFetching } = modelSelectors(model)
  const { reshape = R.identity, reshapeOptions = R.identity } =
    models[model] || {}

  const items = R.map(reshape, getItems(state))
  const options = R.pipe(R.values, specFilter(filter), reshapeOptions)(items)
  const fetching = getFetching(state)
  const item = R.propOr(null, value, items)
  return { item, items, options, fetching }
}
const mapDispatchToProps = (dispatch, { model }) => {
  const { itemsRequested, itemRequested, itemCreated } = modelActions(model)
  return {
    search: params => dispatch(itemsRequested(params, true)),
    create: data => dispatch(itemCreated(data)),
    fetch: id => dispatch(itemRequested(id)),
  }
}

const ModelSelect = connect(mapStateToProps, mapDispatchToProps)(Select)

export default ModelSelect
