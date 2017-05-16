import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { CropBox } from '../CropBox/CropBox'
import { Previews } from '../CropBox/Previews'
import { expand, shrink, dismiss } from './actions'
import * as moment from 'moment'
import './editimage.scss'

const Spinner = () => <div className="spinner">Loading...</div>

let Buttons = ({ expand, shrink, dismiss }) => (
  <div className="Buttons">
    <button onClick={dismiss}>Close</button>
  </div>
)
Buttons = connect(null, dispatch => ({
  expand: e => dispatch(expand()),
  shrink: e => dispatch(shrink()),
  dismiss: e => dispatch(dismiss()),
}))(Buttons)

const subset = ({ id, size, created, filename, crop_box }) => ({
  id,
  size,
  created: moment(created).format('ll'),
  filename,
  crop_box,
})

const ImageData = data => (
  <table className="ImageData">
    <tbody>
      {Object.entries(subset(data)).map(([key, value], i) => (
        <tr key={i}>
          <th>{key}</th><td>{JSON.stringify(value, null, ' ')}</td>
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
      <Buttons />
    </div>
  )
}
EditImage = connect(({ cropWidget, images }) => {
  if (!cropWidget) return { id: 0, image: {} }
  const image = images[cropWidget.id]
  return { ...cropWidget, image }
})(EditImage)

export { EditImage }
