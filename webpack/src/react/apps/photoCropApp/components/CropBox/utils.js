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
