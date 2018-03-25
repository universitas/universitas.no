import React from 'react'
import './upload.scss'
import { formatDate, formatFileSize } from 'utils/text'
import { fingerPrintToDataURL } from 'utils/imageHash'

const ImageData = data => (
  <table>
    <tbody>
      {R.pipe(
        R.filter(Boolean),
        R.map(val => `${val}`),
        R.toPairs,
        R.map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))
      )(data)}
    </tbody>
  </table>
)

const FingerPrint = ({ data }) => (
  <img className="FingerPrint" src={fingerPrintToDataURL(data)} />
)

const ImagePreview = ({
  filename,
  thumb,
  size,
  mimetype,
  date,
  width,
  height,
  md5,
  fingerPrint,
  objectURL,
  timestamp,
  postImage,
  findDuplicateImages,
  dupes = [],
  prodsysURL,
  ...props
}) => (
  <div className="ImagePreview">
    <div className="thumb">
      <img src={thumb} alt={filename} />
    </div>
    <div className="data">
      <div>filename: {filename} </div>
      <div>size: {formatFileSize(size)}</div>
      <div>
        dimensions: {width}x{height}
      </div>
      <div>hash: {md5}</div>
      {fingerPrint && (
        <div>
          fingerprint: <FingerPrint data={fingerPrint} />
        </div>
      )}
      <div>date: {formatDate(date)}</div>
      <ImageData {...props} />
      <button type="button" className="button" onClick={findDuplicateImages}>
        find dupes
      </button>
      <button type="button" className="button" onClick={postImage}>
        post image
      </button>
      {prodsysURL && <a href={prodsysURL}>uploaded</a>}
      {dupes.map(url => (
        <img className="duplicate" width={50} key={url} src={url} />
      ))}
    </div>
  </div>
)

export default ImagePreview
