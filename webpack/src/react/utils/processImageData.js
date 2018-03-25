import * as R from 'ramda'
import loadImage from 'blueimp-load-image/js'
import md5 from './md5hasher'
import { utf8Decode } from 'utils/text'
import { imageFingerPrint } from 'utils/imageHash'

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
  timestamp: performance.now(),
  filename: file.name,
  mimetype: file.type,
  size: file.size,
  date: date || new Date(file.lastModified),
  ...props,
})

// :: string -> Date | string
export const exifDateTime = R.when(
  R.test(/^\d{4}:\d{1,2}:\d{1,2}/),
  R.pipe(R.replace(/:/, '-'), R.replace(/:/, '-'), R.constructN(1, Date))
)

// :: {...tags} -> {artist, date, description}
export const extractExifTags = R.tryCatch(
  R.pipe(
    tags => ({
      artist: tags.Artist,
      date: tags.DateTimeOriginal || tags.DateTime,
      description: tags.ImageDescription,
      imageId: tags.ImageUniqueId,
    }),
    R.map(R.pipe(utf8Decode, exifDateTime))
  ),
  R.always({})
)

const urlToImage = url => {
  const img = new Image()
  img.src = url
  return new Promise(resolve => (img.onload = () => resolve(img)))
}

const withFingerPrint = async props => ({
  fingerPrint: await urlToImage(props.objectURL).then(imageFingerPrint),
  ...props,
})

// filedata = {
//   objectURL,
//   filename,
//   height,
//   width,
//   date,
//   mimetype,
//   size,
//   md5,
//   thumb,
//   ?artist,
//   ?description,
// }
// :: File -> Promise[filedata]
const processImageFile = file =>
  Promise.resolve({ file })
    .then(objectURL)
    .then(loadImageBlueImp)
    .then(withMd5)
    .then(withFingerPrint)
    .then(cleanData)

export default processImageFile
