import React from 'react'

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

const ImagePreview = ({
  filename,
  thumb,
  size,
  mimetype,
  date,
  width,
  height,
  md5,
  objectURL,
  ...props
}) => (
  <div className="ImagePreview">
    <div className="thumb">
      <img src={thumb} alt={filename} />
    </div>
    <div className="data">
      <div>filename: {filename} </div>
      <div>size: {size}</div>
      <div>
        dimensions: {width}x{height}
      </div>
      <div>date: {date.toLocaleDateString()}</div>
      <ImageData {...props} />
    </div>
  </div>
)

export default ImagePreview
