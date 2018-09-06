// Date Field
import { formatDate } from 'utils/text'
import './gridwidget.scss'

const max = R.reduce(R.max, -Infinity)

const Module = ({ size: [columns, rows], current, onClick }) => (
  <div
    className={`Module${current ? ' current' : ''}`}
    onClick={onClick}
    style={{ gridRow: `1 / span ${rows}`, gridColumn: `1 / span ${columns}` }}
    title={`${columns}×${rows}`}
  />
)

class GridWidget extends React.Component {
  static state = { hover: false }
  render() {
    const { onChange, columns, rows, value } = this.props
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

export const EditableField = ({ value = '', onChange }) => (
  <span>
    <GridWidget
      onChange={onChange}
      value={value}
      columns={[2, 3, 4, 6]}
      rows={[1, 2, 3, 4, 5, 6]}
    />
  </span>
)

export const DetailField = ({ value: [columns, rows], ...args }) => (
  <span {...args}>{`${columns}×${rows}`}</span>
)
