import React from 'react'
import FileInput from './FileInput'

class ApiWrapper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children } = this.props
    return (
      <div className="ApiWrapper">
        <h1>Api Wrapper</h1>
        <FileInput accept={['image/jpeg']} handleFileInput={console.log} />
        {children}
      </div>
    )
  }
}

export default ApiWrapper
