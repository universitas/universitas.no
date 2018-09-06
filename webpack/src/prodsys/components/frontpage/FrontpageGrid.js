import cx from 'classnames'
import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import { MODEL, actions, selectors, fields } from './model.js'
import { FeedItem } from 'components/NewsFeed/FeedItem.js'
import { addAdverts } from 'components/NewsFeed/NewsFeed.js'
import Debug from 'components/Debug'
import './FrontpageGrid.scss'

class FeedItemWrapper extends React.Component {
  componentDidUpdate() {
    if (this.props.selected && this.node && this.node.scrollIntoView)
      this.node.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
  }
  clickHandler = ev => {
    ev.stopPropagation()
    const { onClick, selected, pk } = this.props
    onClick(selected ? null : pk)
  }
  refHandler = node => {
    this.node = node
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
    const currentItemId = selectors.getCurrentItemId(state)
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
    onClick: id => actions.reverseUrl({ id }),
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
