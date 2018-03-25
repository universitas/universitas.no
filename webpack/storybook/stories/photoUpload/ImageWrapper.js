import React from 'react'
import mooch from '../assets/mooch.jpg'
import ruter from '../assets/ruter.png'
import vin from '../assets/Vin.png'
import processImageFile from 'utils/processImageData'
import ImagePreview from './ImagePreview'
import { apiFetch, queryString } from 'services/api'
import { jsonToFormData, objectURLtoFile } from 'utils/fileupload'
const imagefiles = [vin, mooch, ruter]

const BASE_URL = 'http://localhost:8000/api'

// Get list data of `model` from django rest api
export const apiList = R.curry((model, attrs) => {
  const query = queryString(attrs)
  const url = query ? `${BASE_URL}/${model}/?${query}` : `${BASE_URL}/${model}/`
  return apiFetch(url)
})

// Post new model instance to api
export const apiPost = R.curry((model, data) => {
  const url = `${BASE_URL}/${model}/`
  const head = { method: 'POST' }
  return apiFetch(url, head, data)
})

const fetchImage = (url, callback) => {
  const filename = url.replace(/^.+\/(.+)\..+\.(.+)$/, '$1.$2')
  fetch(url)
    .then(response => response.blob())
    .then(blob => new File([blob], filename))
    .then(processImageFile)
    .then(callback)
}

// validation function
const validateImageData = image =>
  R.allPass([
    R.propSatisfies(s => s.length > 10, 'description'),
    R.propSatisfies(s => s.length > 10, 'filename'),
    R.propIs(s => s.length > 10, File),
  ])

const fetchDupes = ({ md5, fingerPrint }) =>
  apiList('upload', { md5, fingerPrint }).then(R.path(['response', 'results']))

const uploadImage = ({ artist, description, filename, objectURL }) =>
  objectURLtoFile(objectURL, filename)
    .then(original => ({
      original,
      artist: artist || 'Håken Lid',
      description: description || 'description is missing',
    }))
    .then(jsonToFormData)
    .then(body => apiPost('upload', body))

class ImageWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { files: {} }
    this.findDuplicateImages = this.findDuplicateImages.bind(this)
    this.postImage = this.postImage.bind(this)
  }
  findDuplicateImages(md5) {
    const image = this.state.files[md5]
    fetchDupes(image)
      .then(R.pluck('small'))
      .then(dupes => this.setState(R.assocPath(['files', md5, 'dupes'], dupes)))
  }
  postImage(md5) {
    const image = this.state.files[md5]
    uploadImage(image).then(({ response, error }) => {
      response &&
        this.setState(R.assocPath(['files', md5, 'prodsysURL'], response.url))
      error && this.setState(R.assocPath(['files', md5, 'error'], error))
    })
  }
  componentDidMount() {
    const addImage = data =>
      this.setState(R.assocPath(['files', data.md5], data))
    R.map(url => fetchImage(url, addImage), imagefiles)
  }
  render() {
    const images = this.state.files
    return (
      <div className="ImageList">
        {R.map(key => (
          <ImagePreview
            key={key}
            findDuplicateImages={() => this.findDuplicateImages(key)}
            postImage={() => this.postImage(key)}
            {...images[key]}
          />
        ))(R.keys(images))}
      </div>
    )
  }
}

export default ImageWrapper
