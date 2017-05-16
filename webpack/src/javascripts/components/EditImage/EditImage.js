import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { CropBox } from '../CropBox/CropBox'
import { Previews } from '../CropBox/Previews'
import { autocropImage, expand, shrink, dismiss } from './actions'
import * as moment from 'moment'
import './editimage.scss'

const Spinner = () => <div className="spinner">Loading...</div>

let Buttons = ({ expand, shrink, dismiss, autocrop }) => (
  <div className="Buttons">
    <button onClick={dismiss}>Close</button>
    <button onClick={autocrop}>Autocrop</button>
  </div>
)
Buttons = connect(null, (dispatch, { id }) => ({
  expand: e => dispatch(expand()),
  shrink: e => dispatch(shrink()),
  dismiss: e => dispatch(dismiss()),
  autocrop: e => dispatch(autocropImage(id)),
}))(Buttons)

const subset = ({
  id,
  method,
  cropping_method,
  size,
  created,
  _imagehash,
  filename,
  crop_box,
  is_profile_image,
}) => ({
  id,
  size,
  created: moment(created).format('ll'),
  filename,
  cropping_method: `${method} (${cropping_method})`,
  _imagehash,
  crop_box,
  is_profile_image,
})

const stringify = val =>
  typeof val === 'string' ? val : JSON.stringify(val, null, ' ')

const ImageData = data => (
  <table className="ImageData">
    <tbody>
      {Object.entries(subset(data)).map(([key, value], i) => (
        <tr key={i}>
          <th>{key}</th><td>{stringify(value)}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

let EditImage = ({ id, image, style = {} }) => {
  if (!id) return null
  if (!image) {
    return (
      <div className="EditImage" style={style}>
        <Spinner />
      </div>
    )
  }
  return (
    <div className="EditImage" style={style}>
      <Previews image={image} aspects={[1, 0.5, 2.5]} />
      <CropBox {...image} />
      <ImageData {...image} />
      <Buttons id={id} />
    </div>
  )
}
EditImage = connect(({ cropWidget, images }) => {
  if (!cropWidget) return { id: 0, image: {} }
  const image = images[cropWidget.id]
  return { ...cropWidget, image }
})(EditImage)

export { EditImage }
