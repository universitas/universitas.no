import './FeedImage.scss'
import { getStyles } from 'utils/cropHelpers'

const defaultCropBox = { x: 0.5, y: 0.5, left: 0, top: 0, right: 1, bottom: 1 }

class FeedImage extends React.Component {
  constructor(props) {
    super(props)
    const { moduleSize = [1, 1] } = props
    this.state = {
      aspect: moduleSize[0] / moduleSize[1],
      isMounted: false,
    }
    this.refHandler = node => (this.node = node)
    this.updateSize = () => {
      if (!this.node) return
      const aspect = this.node.offsetWidth / this.node.offsetHeight
      if (aspect != this.state.aspect) this.setState({ aspect })
    }
  }

  componentDidMount() {
    this.updateSize()
    window.addEventListener('resize', this.updateSize)
    setTimeout(() => this.setState(R.assoc('isMounted', true)), 500)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize)
  }
  componentDidUpdate() {
    this.updateSize()
  }

  render() {
    const { imagefile, crop_box = defaultCropBox, moduleSize } = this.props
    const { large, width, height } = imagefile
    const { aspect, isMounted } = this.state
    const style = aspect
      ? getStyles(large, crop_box, width / height, aspect)
      : {}
    if (isMounted) style.transition = 'background 300ms ease'
    return (
      <div ref={this.refHandler} className="FeedImage">
        {style && <div className="inner" style={style} />}
      </div>
    )
  }
}

export default FeedImage
