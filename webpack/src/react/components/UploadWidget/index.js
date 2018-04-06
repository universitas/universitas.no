class UploadWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = { fileList: [] }
  }

  render() {
    const { fileList } = this.props
    return (
      <section className="UploadWidget">
        <UploadButton />
        {fileList.map(props => (
          <ImagePreview key={props.filename} {...props} />
        ))}
      </section>
    )
  }
}

const UploadButton = ({}) => (
  <div className="UploadButton">
    <input type="file">Choose Files</input>
  </div>
)

const ImagePreview = ({ image, url }) => (
  <div className="ImagePreview">
    <img src="{url}" alt="" />
  </div>
)
