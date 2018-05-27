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

const CubeGrid = ({ isLoading }) => (
  <div className={cx({ isLoading, cubeGrid: true })}>
    {R.map(n => <Cube n={n} key={n} isLoading={isLoading} />, R.range(0, 9))}
  </div>
)

const LoadingIndicator = ({ children, isLoading, ...props }) => (
  <div
    {...props}
    className="LoadingIndicator"
    style={{ cursor: props.onClick ? 'pointer' : 'unset' }}
  >
    <CubeGrid isLoading={isLoading} />
    {children}
  </div>
)
export default LoadingIndicator
