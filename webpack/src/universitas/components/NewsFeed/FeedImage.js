import './FeedImage.scss'

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
      : null
    if (isMounted) style.transition = 'background 300ms ease'
    return (
      <div ref={this.refHandler} className="FeedImage">
        {style && <div className="inner" style={style} />}
      </div>
    )
  }
}

export default FeedImage

const position = ({ x = 0.5, y = 0.5 }) => `${x * 100}% ${y * 100}%`

const closeCrop = (x, y, l, r, t, b, A) => {
  const w = r - l
  const h = b - t
  const a = w / h
  const W = 0.5 * Math.min(A, 1, a > A ? w : h * A)
  const H = W / A
  const [X, Y] = [
    W * 2 > w ? [W, (l + r) / 2, 1 - W] : [l + W, x, r - W],
    H * 2 > h ? [H, (t + b) / 2, 1 - H] : [t + H, y, b - H],
  ].map(arr => arr.sort((n, m) => n - m)[1])
  return { left: X - W, right: X + W, top: Y - H, bottom: Y + H }
}

export const getStyles = (src, cropBox, imgRatio, frameRatio) => {
  const { left, top, right, bottom } = closeCrop(
    cropBox.x,
    cropBox.y,
    cropBox.left,
    cropBox.right,
    cropBox.top,
    cropBox.bottom,
    frameRatio / imgRatio,
  )
  const width = right - left
  const height = bottom - top
  return {
    backgroundImage: `url("${src}")`,
    backgroundPosition: [[width, right, 1], [height, bottom, 1]]
      .map(dim => ratioOf(...dim))
      .map(numberToPercent)
      .join(' '),
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${numberToPercent(1 / width)} auto`,
  }
}

// download image and find pixel width and height
export const getImageSize = src =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve([img.width, img.height])
    img.onerror = reject
    img.src = src
  })

// clamp number between min and max
const clamp = (min, max) => n => Math.max(min, Math.min(n, max))

// round to precision 4
export const round = num => Number(num.toPrecision(4))

// relative ratio between low and high
const ratioOf = (low, val, high) =>
  high === low ? 0.5 : (val - low) / (high - low)

// format number 0.5 -> '50%'
const numberToPercent = number => `${(100 * number).toFixed(1)}%`
