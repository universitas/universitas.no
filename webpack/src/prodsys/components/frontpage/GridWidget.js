import { actions, selectors } from './model.js'
import { connect } from 'react-redux'
import './GridWidget.scss'

const max = R.reduce(R.max, -Infinity)

const Module = ({ size: [columns, rows], current, onClick }) => (
  <div
    className={`Module${current ? ' current' : ''}`}
    onClick={onClick}
    style={{ gridRow: `1 / span ${rows}`, gridColumn: `1 / span ${columns}` }}
    title={`${columns}×${rows}`}
  />
)

export class GridWidget extends React.Component {
  static state = { hover: false }
  render() {
    const {
      onChange,
      columns = [2, 3, 4, 6],
      rows = [1, 2, 3, 4, 5, 6],
      value = [2, 2],
    } = this.props
    const grid = `repeat(${max(rows)}, 1fr) / repeat(${max(columns)}, 1fr)`
    const modules = R.map(
      size => <Module key={size} size={size} onClick={() => onChange(size)} />,
      R.reverse(R.xprod(columns, rows)),
    )
    return (
      <div className="GridWidget" style={{ grid }}>
        <Module current size={value} />
        {modules}
      </div>
    )
  }
}

const mapStateToProps = (state, { pk, name = 'size' }) => ({
  value: selectors.getItem(pk)(state)[name],
})
const mapDispatchToProps = (dispatch, { pk, name = 'size' }) => ({
  onChange: value => dispatch(actions.fieldChanged(pk, name, value)),
})
export default connect(mapStateToProps, mapDispatchToProps)(GridWidget)
