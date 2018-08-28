import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel.js'
import Select from './Select.js'
import './Select.scss'

export { Select } // unconnected

const mapStateToProps = (state, { model }) => ({
  items: modelSelectors(model).getItems(state),
})
const mapDispatchToProps = (dispatch, { model }) => ({
  search: params => dispatch(modelActions(model).itemsRequested(params)),
  fetch: id => dispatch(modelActions(model).itemRequested(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Select)
