import { toJson } from 'utils/text'
import cx from 'classnames'

const Debug = props => (
  <div
    className={cx('Debug', props.className)}
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
    {toJson(props)}
  </div>
)

export default Debug
