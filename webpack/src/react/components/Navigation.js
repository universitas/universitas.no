import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const NavInfo = ({ results, last, count, offset }) => (
  <div className="NavInfo info">
    {R.cond([
      [R.isNil, () => 'Laster inn ...'],
      [R.lt(0), () => `resultat ${1 + last - results}–${last} av ${count}`],
      [R.T, () => 'ingen resultater'],
    ])(results)}
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

const Navigation = props => (
  <div className="Navigation">
    <NavInfo {...props} />
    <Pagination {...props} />
  </div>
)

const mapStateToProps = (state, { model }) =>
  modelSelectors(model).getNavigation

const mapDispatchToProps = (dispatch, { model }) => ({
  changePage: params => () =>
    dispatch(modelActions(model).itemsRequested(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
