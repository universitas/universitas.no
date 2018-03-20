import React from 'react'
import cx from 'classnames'

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { acceptFiles: true, dragOver: false }
    this.dragOverHandler = this.dragOverHandler.bind(this)
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this)
    this.dropHandler = this.dropHandler.bind(this)
  }

  dragOverHandler(ev) {
    ev.preventDefault()
    const { accept } = this.props
    let acceptFiles = true
    if (accept) {
      const dt = ev.dataTransfer
      const types = R.pluck('type', dt.items)
      acceptFiles = R.intersection(accept, types).length > 0
    }
    this.setState({ acceptFiles, dragOver: true })
  }
  dropHandler(ev) {
    ev.preventDefault()
    const dt = ev.dataTransfer
    this.setState({ dragOver: false })
    if (this.state.acceptFiles) this.props.handleFileInput(dt.files)
    else alert('not ok')
  }
  dragLeaveHandler(ev) {
    this.setState({ dragOver: false })
  }

  render() {
    const { handleFileInput, accept, children } = this.props
    return (
      <section
        className={cx('FileInput')}
        onDragEnter={this.dragOverHandler}
        onDragOver={this.dragOverHandler}
        onDragLeave={this.dragLeaveHandler}
        onDrop={this.dropHandler}
      >
        <label htmlFor="upload" className={cx(this.state)}>
          Choose files
          <input
            id="upload"
            type="file"
            multiple
            accept={accept && R.join(', ', accept)}
            onChange={ev => {
              ev.stopPropagation()
              handleFileInput(ev.target.files)
            }}
          />
        </label>
        {children}
      </section>
    )
  }
}

export default FileInput
