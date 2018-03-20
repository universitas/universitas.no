import * as R from 'ramda'
import loadImage from 'blueimp-load-image/js'
import md5 from './md5hasher'

const THUMB_SIZE = 200 // pixels

// :: {file, ...props} -> Promise[{file, objectURL, width, height, ...props }]
export const objectURL = props =>
  new Promise((resolve, reject) => {
    const objectURL = URL.createObjectURL(props.file)
    const img = new Image()
    img.src = objectURL
    img.onload = () =>
      resolve({
        objectURL,
        width: img.width,
        height: img.height,
        ...props,
      })
    img.onerror = err => reject(err)
  })

// :: {file, ...props} -> Promise[{file, thumb, ...exifTags, ...props}]
export const loadImageBlueImp = props =>
  // https://github.com/blueimp/JavaScript-Load-Image
  new Promise((resolve, reject) =>
    loadImage(
      props.file,
      (canvas, meta) => {
        if (canvas.type === 'error') reject(canvas)
        resolve({
          ...props,
          thumb: canvas.toDataURL(),
          ...extractExifTags(meta.exif && meta.exif.getAll()),
        })
      },
      { maxHeight: THUMB_SIZE, maxWidth: THUMB_SIZE, canvas: true, meta: true }
    )
  )

// :: {file, ...props} -> Promise[{file, md5, ...props}]
export const withMd5 = props =>
  new Promise(resolve =>
    md5(props.file).then(hash => resolve({ ...props, md5: hash }))
  )

// :: {file, ...props} -> {filename, mimetype, size, ...props}
export const cleanData = ({ file, date, ...props }) => ({
  filename: file.name,
  mimetype: file.type,
  timestamp: Date.now(),
  size: humanizeFileSize(file.size),
  date: date || new Date(file.lastModified),
  ...props,
})

// :: string -> string
export const exifString = R.when(
  R.is(String),
  R.tryCatch(R.pipe(escape, decodeURIComponent), R.nthArg(1))
)

// :: string -> string | Date
export const exifDateTime = R.tryCatch(
  R.pipe(R.replace(/:/, '-'), R.replace(/:/, '-'), R.constructN(1, Date)),
  R.nthArg(1)
)

// :: {...tags} -> {artist, date, description}
export const extractExifTags = R.tryCatch(
  R.pipe(
    tags => ({
      artist: tags.Artist,
      date: tags.DateTimeOriginal || tags.DateTime,
      description: tags.ImageDescription,
    }),
    R.evolve({
      artist: exifString,
      date: exifDateTime,
      description: exifString,
    })
  ),
  R.always({})
)

// :: number -> string
const toFixed = digits => number => number.toPrecision(digits)

// :: number -> string
export const humanizeFileSize = (size, digits = 3) => {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const multiple = Math.floor(Math.log10(size) / 3)
  const number = toFixed(digits)(size / 10 ** (multiple * 3))
  const unit = units[multiple]
  return unit ? `${number} ${unit}` : 'very bigly large size'
}
