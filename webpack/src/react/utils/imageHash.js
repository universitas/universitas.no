// utils for image hashing

// create an image fingerprint to compare with api
// :: (Image, Number) -> String
export const imageFingerPrint = (src, size = 11) => {
  const canvas = createCanvas(size, size, src) // tiny thumbnail
  const imageData = canvasImageData(canvas) // get pixel values
  const lumen = imageDataToLumen(imageData) // grayscale
  return u8tob64(lumen) // encode to base 64
}

// String -> String
export const fingerPrintToDataURL = fingerprint => {
  const lumen = b64tou8(fingerprint)
  const width = Math.round(lumen.length ** 0.5)
  const imageData = lumenToImageData(lumen, width)
  const canvas = createCanvas(width, width)
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

// Calculate ahash from image or canvas
export const ahash = (img, bits = 8) => {
  const [w, h] = [bits, bits]
  const canvas = createCanvas(w, h, img)
  const imageData = canvasImageData(canvas)
  const pixelData = imageDataToLumen(imageData)
  const medianValue = median(pixelData)
  const hash = Array.from(pixelData).map(n => n >= medianValue)
  return hash
}

// Calculate dhash from image or canvas
export const dhash = (img, bits = 8) => {
  const [w, h] = [bits + 1, bits]
  const canvas = createCanvas(w, h, img)
  const imageData = canvasImageData(canvas)
  const pixelData = imageDataToLumen(imageData)
  const hash = []
  for (let i = 0; i < pixelData.length; i++)
    if (i % w - bits) hash.push(pixelData[i] < pixelData[i + 1])
  return hash
}

// resized canvas from image or canvas
// (Number, Number, Image|Canvas) -> Canvas
export const createCanvas = (w, h, src) => {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, w, h)
  src && ctx.drawImage(src, 0, 0, w, h)
  if (src) {
    //ctx.imageSmoothingQuality = 'high'
    //ctx.imageSmootingEnabled = false
  }
  return canvas
}

// ImageData from canvas
const canvasImageData = canvas => {
  const ctx = canvas.getContext('2d')
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// Extract one dimensional luminosity channel from ImageData
// :: ImageData -> Uint8ClampedArray
const imageDataToLumen = (imageData, rgb = [0.2126, 0.7152, 0.0722]) => {
  const [R, G, B] = rgb
  const data = imageData.data
  const L = []
  for (let i = 0; i < data.length; i += 4)
    L.push(R * data[i] + G * data[i + 1] + B * data[i + 2])
  return new Uint8ClampedArray(L)
}

// Convert one dimensional lumen data to monochrome image data
// :: Uint8ClampedArray, Number -> ImageData
const lumenToImageData = (lumen, width) => {
  const height = Math.round(lumen.length / width)
  const imageData = new ImageData(width, height)
  const data = imageData.data
  for (let i = 0; i < lumen.length; i++) {
    for (let j = 0; j < 3; j++) imageData.data[i * 4 + j] = lumen[i] // rgb
    imageData.data[i * 4 + 3] = 255 // alpha
  }
  return imageData
}

// image hash to hexadecimal string
// :: String -> [Boolean]
const hexToHash = hex => {
  const digits = hex
    .split('')
    .map(h =>
      parseInt(h, 16)
        .toString(2)
        .padStart(4, 0)
    )
    .join('')
  return digits.split('').map(d => d === '1')
}

// hexadecimal representation of image hash
// :: [Boolean] -> String
export const hashToHex = hash => {
  let tail = Array.from(hash),
    head = [],
    retval = ''
  while (tail.length) {
    head = tail.slice(-4) // last four digits
    tail = tail.slice(0, -4)
    retval =
      parseInt(head.map(b => (b ? 1 : 0)).join(''), 2).toString(16) + retval
  }
  return retval
}

// 2d thumbnail representation of image hash
// [Boolean] -> Canvas
const hashToCanvas = hash => {
  const w = hash.length ** 0.5
  const ctx = DOM.context2d(w, w)
  const pixelData = [].concat(
    ...hash.map(bit => (bit ? [255, 255, 255, 255] : [0, 0, 0, 255]))
  )
  const data = new ImageData(Uint8ClampedArray.from(pixelData), w, w)
  ctx.putImageData(data, 0, 0)
  return ctx.canvas
}

// Turn canvas to monochrome (in place)
const makeMonochrome = canvas => {
  const ctx = canvas.getContext('2d')
  const data0 = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const lumen = imageDataToLumen(data0)
  const data1 = lumenToImageData(lumen, canvas.width)
  ctx.putImageData(data1, 0, 0)
}

// :: Array | Uint8Array -> Base64 encoded string
const u8tob64 = u8 =>
  btoa(String.fromCharCode.apply(null, new Uint8ClampedArray(u8)))

// :: Base64 encoded string -> Uint8Array
const b64tou8 = b64 =>
  Uint8ClampedArray.from(
    atob(b64)
      .split('')
      .map(c => c.charCodeAt(0))
  )
