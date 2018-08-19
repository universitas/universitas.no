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

export const DetailField = ({ value, item, className, ...args }) => {
  const { width, height, small, large } = item

  return (
    <div className={cx('Thumb', className)}>
      <FullThumbWithCropBox
        src={small}
        width={width}
        value={value}
        height={height}
      />
    </div>
  )
}

export const EditableField = ({
  value,
  item,
  className,
  onChange,
  ...args
}) => {
  const { width, height, small, large } = item

  return (
    <div className={cx('Thumb', className)}>
      <CropBox
        src={small}
        value={value}
        size={[width, height]}
        onChange={onChange}
      />
    </div>
  )
}
