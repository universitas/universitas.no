import { reverse, toStory } from 'universitas/ducks/router'
import RelatedStory from 'components/RelatedStory'
import { shuffle } from 'utils/misc'
import Advert from 'components/Advert'

const STROSSLE_ID = 'dff15dfe-e8ca-4e6d-b547-8038ab88562b'

const ACCELERATOR_ID = 'cf6209fc-8eae-4041-bbf9-6d9129336326'

class StrossleWidget extends React.Component {
  constructor(props) {
    super(props)
    const strossleMount = () => {
      global.strossle && global.strossle(STROSSLE_ID, '.strossle-widget')
    }

   const acceleratorMount = () => {
     global.strossle && global.strossle(ACCELERATOR_ID, '.strossle-widget')
   }

    this.componentDidMount = strossleMount && acceleratorMount
    this.componentDidUpdate = strossleMount && acceleratorMount
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.url != this.props.url
  }

  render() {
    return ( 
          <div className="strossle-widget"/>
        )
      }
  }

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

const pickRelated = R.pipe(
  shuffle,
  R.take(3),
)

const RelatedStories = ({ related_stories }) => (
  <section className="RelatedStories">
    <h2 className="sectionTitle">Les også disse sakene:</h2>
    {pickRelated(related_stories).map((id, idx) => (
      <RelatedStory key={idx} id={id} />
    ))}
  </section>
)

const StoryFoot = ({
  comment_field,
  strossle_enabled = true,
  id,
  title,
  section,
  related_stories,
}) => {
  const url = `https://universitas.no${reverse(
    toStory({ id, section, title }),
  )}`

  return (
    <footer className="StoryFoot">
      {comment_field == 'facebook' && <FacebookComments url={url} />}
      {strossle_enabled ? (
        <StrossleWidget />
      ) : (
        <RelatedStories related_stories={related_stories} />
      )}
    </footer>
  )
}

export default StoryFoot
