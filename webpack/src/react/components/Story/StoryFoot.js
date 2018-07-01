import { reverse, toStory } from 'ducks/router'

class FacebookComments extends React.Component {
  constructor(props) {
    super(props)
    const facebookParse = () =>
      global.FB && global.FB.XFBML.parse(this.element.parentElement)
    this.componentDidMount = facebookParse
    this.componentDidUpdate = facebookParse
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.url != this.props.url
  }

  render() {
    return (
      <div
        className="fb-comments"
        data-href={this.props.url}
        data-numposts={10}
        data-width={'100%'}
        ref={el => (this.element = el)}
      />
    )
  }
}

const StoryFoot = ({ comment_field, id, title, section }) => {
  const url = `http://universitas.no${reverse(toStory({ id, section, title }))}`

  return (
    <footer className="StoryFoot">
      {comment_field == 'facebook' && <FacebookComments url={url} />}
    </footer>
  )
}

export default StoryFoot
