import { getStyles } from 'utils/cropHelpers'

let PreviewImg = ({ src, crop_box, size, aspect, style = {} }) => {
  const styles = getStyles(src, crop_box, size[0] / size[1], aspect)
  const items = {
    position: styles.backgroundPosition,
    size: styles.backgroundSize,
    'aspect ratio': aspect,
  }
  return (
    <div className="PreviewImg" style={style}>
      <svg style={styles} viewBox={`0 0 ${aspect * 2} 2`} />
    </div>
  )
}
PreviewImg.propTypes = {
  aspect: PropTypes.number.isRequired,
  style: PropTypes.object,
  crop_box: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  size: PropTypes.array.isRequired,
}

const CropPreview = ({ aspects = [2], flexDirection = 'row', ...image }) => (
  <div className="CropPreview" style={{ flexDirection }}>
    {aspects.map((aspect, i) => (
      <PreviewImg
        key={i}
        aspect={aspect}
        style={{ flex: flexDirection === 'row' ? aspect : 1 / aspect }}
        {...image}
      />
    ))}
  </div>
)
CropPreview.propTypes = {
  aspects: PropTypes.array,
  flexDirection: PropTypes.string,
  crop_box: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  size: PropTypes.array.isRequired,
}

export default CropPreview
