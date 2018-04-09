import * as R from 'ramda'
import React from 'react'
import cx from 'classnames'
import processImageFile from 'utils/processImageData'
import 'styles/uploadinput.scss'

const filterValidFiles = accept =>
  accept.length ? R.filter(file => R.contains(file.type, accept)) : Array.from

const preventDefault = ev => ev.preventDefault()

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { acceptFiles: true, dragOver: 0 }
    this.filterValidFiles = filterValidFiles(props.accept)
    this.dragEnterHandler = this.dragEnterHandler.bind(this)
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this)
    this.dropHandler = this.dropHandler.bind(this)
    this.handleNewFiles = this.handleNewFiles.bind(this)
  }

  dragEnterHandler(ev) {
    const validFiles = this.filterValidFiles(ev.dataTransfer.items)
    const acceptFiles = validFiles.length > 0
    this.setState({ acceptFiles, dragOver: this.state.dragOver + 1 })
    ev.dataTransfer.dropEffect = acceptFiles ? 'copy' : 'none'
    ev.preventDefault()
  }

  dragLeaveHandler(ev) {
    this.setState({ dragOver: this.state.dragOver - 1 })
  }

  dropHandler(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    this.setState({ dragOver: 0 })
    this.handleNewFiles(ev.dataTransfer.files)
  }

  handleNewFiles(inputFiles) {
    const { fileAdded, fileError } = this.props
    const validFiles = this.filterValidFiles(inputFiles)

    R.map(file =>
      processImageFile(file)
        .then(fileAdded)
        .catch(fileError)
    )(validFiles)
  }

  render() {
    const { acceptFiles, dragOver } = this.state
    const { accept, children, label, className } = this.props
    return label ? (
      <label className={cx(className, 'FileInput', 'button')}>
        {label}
        <input
          multiple
          type="file"
          accept={accept && R.join(', ', accept)}
          onChange={ev => {
            ev.stopPropagation()
            this.handleNewFiles(ev.target.files)
            ev.target.value = null
          }}
        />
      </label>
    ) : (
      <section
        className={cx(className, 'FileInput', 'area', {
          dragOver,
          acceptFiles,
        })}
        onDragEnter={this.dragEnterHandler}
        onDragOver={preventDefault}
        onDragLeave={this.dragLeaveHandler}
        onDrop={this.dropHandler}
      >
        <div className="items">{children}</div>
      </section>
    )
  }
}

FileInput.defaultProps = {
  accept: [],
  text: 'upload files',
  fileAdded: console.log,
  fileError: console.error,
}

export default FileInput
