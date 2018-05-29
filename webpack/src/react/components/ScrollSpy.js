import { debounce } from 'utils/misc'

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
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }
  render() {
    return (
      <div className="ScrollSpy" ref={el => (this.element = el)}>
        {this.props.children}
      </div>
    )
  }
}

export default ScrollSpy
