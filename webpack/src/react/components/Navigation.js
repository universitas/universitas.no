import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const Navigation = ({ results, last, count, offset, ...props }) => (
  <div className="Navigation">
    <div className="info">
      resultat {1 + last - results}–{last} av {count}
    </div>
    <Pagination {...props} />
  </div>
)
const Pagination = ({ changePage, next, previous }) =>
  next || previous ? (
    <span>
      <button onClick={changePage(previous)} disabled={!previous}>
        bakover
      </button>
      <button onClick={changePage(next)} disabled={!next}>
        fremover
      </button>
    </span>
  ) : null

const mapStateToProps = (state, { model }) =>
  modelSelectors(model).getNavigation

const mapDispatchToProps = (dispatch, { model }) => ({
  changePage: params => () =>
    dispatch(modelActions(model).itemsRequested(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
