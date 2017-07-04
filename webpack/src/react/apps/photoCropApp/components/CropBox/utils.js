export const normalize = ({ x, y, left, top, right, bottom }) => {
  const func = (a, b) => a - b
  const h_sorted = [0, 0, left, right, 1, 1].sort(func)
  const v_sorted = [0, 0, top, bottom, 1, 1].sort(func)
  return {
    x: [0, x, 1].sort(func)[1],
    y: [0, y, 1].sort(func)[1],
    left: h_sorted[2],
    top: v_sorted[2],
    right: h_sorted[3],
    bottom: v_sorted[3],
  }
}

export const round = num => Number(num.toPrecision(4))

export const getStyles = (src, crop_box, imgRatio, frameRatio) => {
  const { left, top, right, bottom } = closeCrop(
    crop_box.x,
    crop_box.y,
    crop_box.left,
    crop_box.right,
    crop_box.top,
    crop_box.bottom,
    frameRatio / imgRatio
  )
  const width = right - left
  const height = bottom - top
  const ratioOf = (low, val, high) =>
    high === low ? 0.5 : (val - low) / (high - low)
  const numberToPercent = number => `${(100 * number).toFixed(1)}%`
  return {
    backgroundImage: `url(${src})`,
    backgroundPosition: [[width, right, 1], [height, bottom, 1]]
      .map(dim => ratioOf(...dim))
      .map(numberToPercent)
      .join(' '),
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${numberToPercent(1 / width)} auto`,
  }
}
