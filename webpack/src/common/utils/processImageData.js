// client side image processing before file upload

import loadImage from 'blueimp-load-image/js'
import md5 from './md5hasher'
import { utf8Decode } from 'utils/text'
import { imageFingerPrint } from 'utils/imageHash'

const THUMB_SIZE = 600 // pixels image preview size

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

// :: {file, ...props} -> Promise[{file, small, ...exifTags, ...props}]
export const loadImageBlueImp = props =>
  // https://github.com/blueimp/JavaScript-Load-Image
  new Promise((resolve, reject) =>
    loadImage(
      props.file,
      (canvas, meta) => {
        if (canvas.type === 'error') reject(canvas)
        resolve({
          ...props,
          small: canvas.toDataURL(),
          ...extractExifTags(meta.exif && meta.exif.getAll()),
        })
      },
      { maxHeight: THUMB_SIZE, maxWidth: THUMB_SIZE, canvas: true, meta: true },
    ),
  )

// :: {file, ...props} -> Promise[{file, md5, ...props}]
export const withMd5 = props =>
  new Promise(resolve =>
    md5(props.file).then(hash => resolve({ ...props, md5: hash })),
  )

// :: string -> Date | string
export const exifDateTime = R.when(
  R.test(/^\d{4}:\d{1,2}:\d{1,2}/),
  R.pipe(
    R.replace(/:/, '-'),
    R.replace(/:/, '-'),
    R.constructN(1, Date),
  ),
)

// :: Strip null characters and trim if string
const stripNull = R.when(
  R.is(String),
  R.pipe(
    R.replace(/\0/g, ''),
    R.trim,
  ),
)

// :: {...tags} -> {artist, created, description}
const _extractExifTags = R.pipe(
  tags => ({
    artist: tags.Artist,
    created: tags.DateTimeOriginal || tags.DateTime,
    description: tags.ImageDescription,
    imageId: tags.ImageUniqueId,
  }),
  R.map(
    R.pipe(
      stripNull,
      utf8Decode,
      exifDateTime,
    ),
  ),
)
export const extractExifTags = R.tryCatch(_extractExifTags, R.always({}))

const urlToImage = url => {
  const img = new Image()
  img.src = url
  return new Promise(resolve => (img.onload = () => resolve(img)))
}

const withFingerPrint = async props => ({
  fingerprint: await urlToImage(props.objectURL).then(imageFingerPrint),
  ...props,
})

// :: {file, ...props} -> {filename, mimetype, filesize, ...props}
export const cleanData = ({ file, created, ...props }) => ({
  timestamp: performance.now(),
  filename: file.name,
  mimetype: file.type,
  filesize: file.size,
  created: created || new Date(file.lastModified),
  ...props,
})

// Extract artist name from description.
export const artistFromDescription = ({
  artist = '',
  description = '',
  ...props
}) => {
  const regex = /(?:(?:f|ph)oto(?:cred|graf|manipulasjon|):? )(([^\s.]\.?[^\s.]* ?)+.?)/i
  return {
    ...props,
    description: R.pipe(
      R.replace(regex, ''),
      R.trim,
    )(description),
    artist:
      artist ||
      R.pipe(
        R.match(regex),
        R.propOr('', 1),
        R.replace(/[\s.]+$/g, ''), // strip trailing `.` characters
        R.trim,
      )(description),
  }
}

// shape of return value from processImageFile
// filedata = {
//   objectURL,   string
//   filename,    string
//   height,      number
//   width,       number
//   created,     Date
//   mimetype,    string
//   filesize,    number
//   md5,         string
//   small,       string
//   ?artist,     string
//   ?description string
// }

// :: File -> Promise[filedata]
const processImageFile = file =>
  Promise.resolve({ file })
    .then(objectURL)
    .then(loadImageBlueImp)
    .then(withMd5)
    .then(withFingerPrint)
    .then(artistFromDescription)
    .then(cleanData)

export default processImageFile
