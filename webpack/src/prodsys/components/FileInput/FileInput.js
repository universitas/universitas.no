import cx from 'classnames'
import processImageFile from 'utils/processImageData'

class BaseFileInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleNewFiles = this.handleNewFiles.bind(this)
    this.filterValidFiles = this.filterValidFiles.bind(this)
  }

  filterValidFiles(files) {
    const { accept } = this.props
    const filter =
      accept && accept.length
        ? R.filter(file => R.contains(file.type, accept))
        : Array.from
    return filter(files)
  }

  handleNewFiles(inputFiles) {
    const { fileAdded, fileError } = this.props
    const validFiles = this.filterValidFiles(inputFiles)
    R.map(file =>
      processImageFile(file)
        .then(fileAdded)
        .catch(fileError),
    )(validFiles)
  }
}

BaseFileInput.defaultProps = {
  accept: [],
  fileAdded: console.log,
  fileError: console.error,
}

class FileInputButton extends BaseFileInput {
  render() {
    const { accept, label = 'upload', className } = this.props
    return (
      <label className={cx(className, 'FileInputButton')}>
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
    )
  }
}

class FileInputArea extends BaseFileInput {
  constructor(props) {
    super(props)
    this.state = { acceptFiles: true, dragOver: 0 }
    this.dragEnterHandler = this.dragEnterHandler.bind(this)
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this)
    this.dragOverHandler = ev => ev.preventDefault()
    this.dropHandler = this.dropHandler.bind(this)
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

  render() {
    const { acceptFiles, dragOver } = this.state
    const { accept, children, className } = this.props
    return (
      <section
        className={cx(className, 'FileInputArea', {
          dragOver,
          acceptFiles,
        })}
        onDragEnter={this.dragEnterHandler}
        onDragOver={this.dragOverHandler}
        onDragLeave={this.dragLeaveHandler}
        onDrop={this.dropHandler}
      >
        <div className="items">{children}</div>
      </section>
    )
  }
}

export { FileInputArea, FileInputButton }
