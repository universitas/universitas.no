import { debounce, isVisible } from 'utils/misc'
import LoadingIndicator from 'components/LoadingIndicator'

const FeedEnd = ({}) => <div className="FeedEnd">ingen flere saker</div>

export const LoadMore = ({
  fetching,
  feedRequested,
  offset = null,
  next = true,
}) => {
  if (!next) return <FeedEnd />
  const fetch = () => feedRequested({ offset })
  const scrollHandler = el => fetching || (isVisible(el, 500) && fetch())
  const clickHandler = () => fetching || fetch()
  return (
    <ScrollSpy onScroll={scrollHandler}>
      <LoadingIndicator onClick={clickHandler} isLoading={fetching} />
    </ScrollSpy>
  )
}

class ScrollSpy extends React.Component {
  constructor(props) {
    super(props)
    const { onVisible, onScroll } = props
    this.scrollHandler = this.scrollHandler.bind(this)
  }

  scrollHandler() {
    debounce(this.props.onScroll)(this.element)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandler, {
      capture: true,
      passive: true,
    })
    this.scrollHandler()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }
  render() {
    return (
      <div
        className="ScrollSpy"
        style={{ gridColumnEnd: 'span 6', gridRowEnd: 'span 3' }}
        ref={el => (this.element = el)}
      >
        {this.props.children}
      </div>
    )
  }
}
export { ScrollSpy }
export default LoadMore
