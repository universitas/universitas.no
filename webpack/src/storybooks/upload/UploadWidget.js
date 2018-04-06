import React from 'react'
import * as R from 'ramda'
import FileInput from './FileInput'
import ImagePreview from './ImagePreview'
import processImageFile from 'utils/processImageData'
import './upload.scss'

class UploadWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = { fileList: {} }
    this.handleFileInput = this.handleFileInput.bind(this)
  }
  handleFileInput(files) {
    const { accept } = this.props
    const updateState = data => {
      this.setState({
        fileList: { ...this.state.fileList, [data.md5]: data },
      })
    }
    const acceptFilter = accept ? ({ type }) => R.contains(type, accept) : R.T
    const pipeline = R.pipe(
      R.filter(acceptFilter),
      R.map(file =>
        processImageFile(file)
          .then(updateState)
          .catch(console.error)
      )
    )
    pipeline(files)
  }

  render() {
    const { fileList } = this.state
    const { accept } = this.props
    return (
      <section className="UploadWidget">
        <FileInput accept={accept} handleFileInput={this.handleFileInput}>
          {R.pipe(
            R.values,
            R.sortBy(R.prop('timestamp')),
            R.reverse,
            R.map(props => <ImagePreview key={props.filename} {...props} />)
          )(fileList)}
        </FileInput>
      </section>
    )
  }
}
UploadWidget.defaultProps = {
  accept: ['image/png', 'image/jpeg'],
}

export default UploadWidget
