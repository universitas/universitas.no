import cx from 'classnames'
import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import { MODEL, actions, selectors, fields } from './model.js'
import FeedItem from 'universitas/components/NewsFeed/FeedItem.js'
import { addAdverts } from 'universitas/components/NewsFeed/NewsFeed.js'
import Debug from 'components/Debug'
import './FrontpageGrid.scss'
import { getRoutePayload, toRoute } from 'prodsys/ducks/router'

class FeedItemWrapper extends React.Component {
  scrollTo = () => {
    // for some reason this doesn't always work unless we do it async
    clearTimeout(this.timeout)
    this.timeout = setTimeout(
      () =>
        this.node.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        }),
      200,
    )
  }
  clickHandler = ev => {
    ev.stopPropagation()
    const { onClick, selected, pk } = this.props
    onClick(selected ? null : pk)
  }
  refHandler = node => {
    this.node = node
  }
  componentDidUpdate() {
    this.props.selected && this.scrollTo()
  }
  render() {
    const { className, children } = this.props
    return (
      <div
        onClick={this.clickHandler}
        ref={this.refHandler}
        className={className}
        children={children}
      />
    )
  }
}

const ConnectedFeedItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const currentItemId = getRoutePayload(state).pk
    const selected = pk == currentItemId
    const unselected = currentItemId && !selected
    const { dirty, published } = data
    const className = cx('FeedItemWrapper', {
      dirty,
      selected,
      unpublished: !published,
      unselected,
    })
    return {
      sectionName: data.story.section,
      ...data,
      dirty: false,
      selected,
      className,
      model: MODEL,
    }
  },
  {
    onClick: pk => toRoute({ model: MODEL, action: 'change', pk: pk }),
  },
)(props => <FeedItem Wrapper={FeedItemWrapper} {...props} />)

const DummyAd = () => (
  <div className="Advert col-6 row-1">
    <p style={{ textAlign: 'center', fontSize: '1.5rem', color: '#999' }}>
      [ annonse ]
    </p>
  </div>
)
const withAds = addAdverts([1, 2, 3, 4].map(key => <DummyAd key={key} />))

const FrontpageGrid = ({ items = [] }) => {
  const feed = R.map(pk => <ConnectedFeedItem key={pk} pk={pk} />)(items)
  return (
    <section
      className="NewsFeed"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
      }}
    >
      {withAds(feed)}
    </section>
  )
}

export default FrontpageGrid
