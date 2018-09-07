// CropBoxField

import cx from 'classnames'
import CropBox from '@haakenlid/photocrop'

const FullThumbWithCropBox = ({ src, title, width, height, value }) => {
  const { left, x, right, top, y, bottom } = value
  const boxPath = `M0, 0H1V1H0Z M${left}, ${top}V${bottom}H${right}V${top}Z`
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <image xlinkHref={src} width="100%" height="100%" />
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        height="100%"
        width="100%"
      >
        <path className="cropOverlay" fillRule="evenodd" d={boxPath} />
      </svg>
    </svg>
  )
}

// const FullThumb = ({ src, title, width, height }) => (
//   <svg className="Thumb" viewBox={`0 0 ${width} ${height}`}>
//     <image xlinkHref={src} width="100%" height="100%" />
//     <Frame />
//   </svg>
// )

const StaticCropBox = ({ value, item, className, ...args }) => {
  const { width, height, small, large } = item
  const src = small
  return (
    <div className={cx('Thumb', className)}>
      <FullThumbWithCropBox
        src={src}
        width={width}
        value={value}
        height={height}
      />
    </div>
  )
}

class CropBoxField extends React.Component {
  constructor(props) {
    super(props)
    this.container = React.createRef()
    this.state = { height: 0 }
  }
  componentDidMount() {
    const height = this.container.current.scrollHeight
    this.setState({ height })
  }

  render() {
    const { value, item, className, onChange, previews = [] } = this.props
    const { width = 1000, height = 1000, small, large } = item
    const src = this.state.height < 200 ? small : large

    return (
      <div className={cx('Thumb', className)} ref={this.container}>
        <CropBox
          src={src}
          value={value}
          size={[width, height]}
          onChange={onChange}
          previews={previews}
        />
      </div>
    )
  }
}

export { CropBoxField as EditableField, StaticCropBox as DetailField }
