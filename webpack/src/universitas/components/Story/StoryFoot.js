import { reverse, toStory } from 'ducks/router'
import RelatedStory from 'components/RelatedStory'
import { shuffle } from 'utils/misc'
import Advert from 'components/Advert'

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

const pickRelated = R.pipe(shuffle, R.take(3))

const RelatedStories = ({ related_stories }) => (
  <section className="RelatedStories">
    <h2 className="sectionTitle">Les også disse sakene:</h2>
    {pickRelated(related_stories).map((id, idx) => (
      <RelatedStory key={idx} id={id} />
    ))}
  </section>
)

const StoryFoot = ({ comment_field, id, title, section, related_stories }) => {
  const url = `http://universitas.no${reverse(toStory({ id, section, title }))}`

  return (
    <footer className="StoryFoot">
      {comment_field == 'facebook' && <FacebookComments url={url} />}
      <RelatedStories related_stories={related_stories} />
      <Advert.Google />
    </footer>
  )
}

export default StoryFoot
