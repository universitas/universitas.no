// import * as R from 'ramda'
import React from 'react'
import cx from 'classnames'
import './upload.scss'

const validate_files = accept =>
  accept.length ? R.filter(file => R.contains(file.type, accept)) : Array.from

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { messages: [], acceptFiles: true, dragOver: 0 }
    this.dragEnterHandler = this.dragEnterHandler.bind(this)
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this)
    this.dropHandler = this.dropHandler.bind(this)
    this.handleFileInput = this.handleFileInput.bind(this)
    this.message = this.message.bind(this)
    this.validate_files = validate_files(props.accept)
  }
  message(text, timeout = 2000) {
    this.setState({ messages: [text, ...this.state.messages] })
    setTimeout(
      () => this.setState({ messages: R.without([text], this.state.messages) }),
      timeout
    )
  }
  dragEnterHandler(ev) {
    ev.preventDefault()
    const files = this.validate_files(ev.dataTransfer.items)
    this.setState({
      acceptFiles: files.length > 0,
      dragOver: this.state.dragOver + 1,
    })
  }
  dropHandler(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    // for (const item of ev.dataTransfer.items) {
    //   if (item.kind === 'file') continue
    //   const itemtype = item.type
    //   item.getAsString(s => console.log(itemtype, s))
    // }
    this.setState({ dragOver: 0 })
    this.handleFileInput(ev.dataTransfer.files)
  }
  dragLeaveHandler(ev) {
    this.setState({ dragOver: this.state.dragOver - 1 })
  }
  handleFileInput(inputFiles) {
    const files = this.validate_files(inputFiles)
    if (files.length == 0) {
      this.message('incorrect file type!')
      return
    }
    if (!this.props.multiple && files.length > 1) {
      this.message('only one file, please!')
      return
    }
    const fileTypes = R.pipe(R.pluck('type'), R.join(', '))(files)
    this.message(`filetypes: ${fileTypes}`, 1000)
    this.props.handleFileInput(files)
  }
  render() {
    const { acceptFiles, dragOver, messages } = this.state
    const { multiple, accept, children, text } = this.props
    return (
      <section
        className={cx('FileInput')}
        onDragEnter={this.dragEnterHandler}
        onDragLeave={this.dragLeaveHandler}
        onDrop={this.dropHandler}
        onDragOver={ev => ev.preventDefault()}
      >
        <label htmlFor="upload" className={cx({ dragOver, acceptFiles })}>
          {messages[0] || text}
          <input
            id="upload"
            type="file"
            multiple={multiple}
            accept={accept && R.join(', ', accept)}
            onChange={ev => {
              ev.stopPropagation()
              this.handleFileInput(ev.target.files)
            }}
          />
        </label>
        {/* pass file previews as children */}
        {children}
      </section>
    )
  }
}
FileInput.defaultProps = {
  multiple: true,
  accept: [],
  text: 'Drag files or click here to upload',
}

export default FileInput
