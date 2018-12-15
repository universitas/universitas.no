import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const PagInfo = ({ ids = [], last, count, offset }) => (
  <div className="PagInfo info">
    {R.cond([
      [R.isNil, () => 'Laster inn ...'],
      [R.lt(0), n => `resultat ${1 + last - n}–${last} av ${count}`],
      [R.T, () => 'ingen resultater'],
    ])(ids.length)}
  </div>
)

const PagButtons = ({ changePage, next, previous }) =>
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

const Pagination = props => (
  <div className="Pagination">
    <PagInfo {...props} />
    <PagButtons {...props} />
  </div>
)

const mapStateToProps = (state, { model }) =>
  modelSelectors(model).getPagination

const mapDispatchToProps = (dispatch, { model }) => ({
  changePage: params => () =>
    dispatch(modelActions(model).itemsRequested(params, true)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pagination)
