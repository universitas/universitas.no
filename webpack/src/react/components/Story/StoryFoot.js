import { reverse, toStory } from 'ducks/router'

class FacebookComments extends React.Component {
  constructor(props) {
    super(props)
    this.element = React.createRef()
    const facebookParse = () =>
      global.FB && global.FB.XFBML.parse(this.element.parentElement)
    this.componentDidMount = facebookParse
    this.componentDidUpdate = facebookParse
  }

  render() {
    return (
      <div
        className="fb-comments"
        data-href={this.props.url || global.location.href}
        data-numposts={10}
        data-width={'100%'}
        ref={this.element}
      />
    )
  }
}

const StoryFoot = props => (
  <footer className="StoryFoot">
    {props.comment_field == 'facebook' && (
      <FacebookComments
        url={`http://universitas.no${reverse(toStory(props))}`}
      />
    )}
  </footer>
)

export default StoryFoot
