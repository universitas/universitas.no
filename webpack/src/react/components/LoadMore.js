import { debounce, isVisible } from 'utils/misc'
import LoadingIndicator from 'components/LoadingIndicator'

const FeedEnd = ({}) => <div className="FeedEnd">ingen flere saker</div>
const SCROLLOFFSET = 500

export const LoadMore = ({ fetchMore, fetching, next = true }) => {
  const scrollHandler = el =>
    fetching || (isVisible(el, SCROLLOFFSET) && fetchMore())
  const clickHandler = () => fetching || fetchMore()
  return next ? (
    <ScrollSpy onScroll={scrollHandler}>
      <LoadingIndicator onClick={clickHandler} fetching={fetching} />
    </ScrollSpy>
  ) : (
    <FeedEnd />
  )
}

class ScrollSpy extends React.Component {
  constructor(props) {
    super(props)
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
  componentDidUpdate() {
    this.scrollHandler()
  }
  render() {
    return (
      <div className="ScrollSpy" ref={el => (this.element = el)}>
        {this.props.children}
      </div>
    )
  }
}
export { ScrollSpy }
export default LoadMore
