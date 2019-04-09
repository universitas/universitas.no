import cx from 'classnames'
import './LoadingIndicator.scss'

class Cube extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: props.isLoading,
      isQuiet: !props.isLoading,
    }
    this.handleAnimate = this.handleAnimate.bind(this)
  }
  handleAnimate() {
    if (this.props.isLoading) return
    this.setState({ isLoading: false, isQuiet: true })
  }
  componentWillReceiveProps({ isLoading }) {
    if (!isLoading) return
    this.setState({ isLoading: true, isQuiet: false })
  }
  render() {
    return (
      <div
        className={cx('cube', `cube-${this.props.n}`, this.state)}
        onAnimationIteration={this.handleAnimate}
      />
    )
  }
}

const CubeGrid = ({ fetching }) => (
  <div className={cx({ fetching, cubeGrid: true })}>
    {R.map(
      n => (
        <Cube n={n} key={n} isLoading={fetching} />
      ),
      R.range(0, 9),
    )}
  </div>
)

export const JsonLoader = ({ children, ...props }) => (
  <div className="LoadingIndicator">
    <pre style={{ whiteSpace: 'pre-wrap' }} className="Loading">
      {JSON.stringify(props, null, 2)}
    </pre>
    {children}
  </div>
)

const LoadingIndicator = ({ debug, ...props }) =>
  debug ? (
    <JsonLoader {...props} />
  ) : (
    <div
      className={cx('LoadingIndicator', props.className)}
      style={{ cursor: props.onClick ? 'pointer' : 'unset' }}
      onClick={props.onClick}
    >
      <CubeGrid {...props} />
      {props.children}
    </div>
  )

export default LoadingIndicator
