import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const Navigation = ({
  previous,
  next,
  results,
  last,
  count,
  offset,
  changePage,
}) => (
  <div className="Navigation">
    <div className="info">
      resultat {1 + last - results}–{last} av {count}
    </div>
    {(previous || next) &&
      <span>
        <button
          onClick={changePage(previous)}
          disabled={!previous}
          title={previous}
        >
          bakover
        </button>
        <button onClick={changePage(next)} disabled={!next} title={next}>
          fremover
        </button>
      </span>}
  </div>
)

const mapStateToProps = (state, { model }) =>
  modelSelectors(model).getNavigation

const mapDispatchToProps = (dispatch, { model }) => ({
  changePage: url => () => dispatch(modelActions(model).itemsRequested(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
