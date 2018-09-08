import { toJson } from 'utils/text'
import cx from 'classnames'

class Debug extends React.Component {
  componentDidMount() {
    console.error('Debug', toJson(this.props))
  }

  render() {
    return (
      <div
        className={cx('Debug', this.props.className)}
        style={{
          background: '#010',
          borderRadius: '0.5em',
          color: '#af5',
          padding: '0.5em',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          lineHeight: 1.1,
          whiteSpace: 'pre-wrap',
          flex: 1,
          overflow: 'auto',
          maxHeight: '100%',
          minHeight: '0',
        }}
      >
        {toJson(this.props)}
      </div>
    )
  }
}

export default Debug
