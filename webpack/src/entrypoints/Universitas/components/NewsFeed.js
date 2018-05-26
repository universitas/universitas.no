import { connect } from 'react-redux'
import { getFeed, feedRequested } from 'ducks/newsFeed'

const Loading = ({ feedRequested, fetching, ...props }) => (
  <div ref={fetching || feedRequested} className="Loading">
    loading ...
  </div>
)

const FeedItem = ({ headline, image, story_url, columns, rows }) => {
  const style = {}
  return (
    <article className="FeedItem" style={style}>
      <a href={story_url}>
        <img src={image} />
        <h1>{headline}</h1>
      </a>
    </article>
  )
}

const Feed = ({ fetching, results, next }) => (
  <section className="NewsFeed">
    <h1>Feed</h1>
    {results.map(props => <FeedItem key={props.id} {...props} />)}
  </section>
)

const NewsFeed = props => {
  if (R.isEmpty(props.results)) return <Loading {...props} />
  else return <Feed {...props} />
}

const mapStateToProps = state => getFeed(state)
const mapDispatchToProps = { feedRequested }
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)
