// import { reverseFull, toStory } from 'ducks/router'

class FacebookComments extends React.Component {
  componentDidMount() {
    global.FB && global.FB.XFBML.parse()
  }
  componentDidUpdate() {
    global.FB && global.FB.XFBML.parse()
  }

  render() {
    return (
      <div
        className="fb-comments"
        data-href={global.location.href}
        data-numposts={5}
        data-width={'100%'}
      />
    )
  }
}

const StoryFoot = props => (
  <div className="StoryFoot">
    {props.comment_field == 'facebook' && <FacebookComments />}
  </div>
)

export default StoryFoot
