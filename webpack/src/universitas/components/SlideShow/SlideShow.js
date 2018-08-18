import './SlideShow.scss'

class SlideShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = { index: 0, forward: true }
    this.nextSlide = ev =>
      this.setState({
        forward: true,
        index: (this.state.index + 1) % this.props.children.length,
      })
    this.prevSlide = ev =>
      this.setState({
        forward: false,
        index: (this.state.index || this.props.children.length) - 1,
      })
  }

  render() {
    const { children } = this.props
    const { index } = this.state
    if (!children || children.length == 0) return null
    if (children.length == 1) return children[0]
    return (
      <div className="SlideShow">
        <div className="next" onClick={this.nextSlide} />
        <div className="prev" onClick={this.prevSlide} />
        <div className="slide">{children[index]}</div>
      </div>
    )
  }
}

export default SlideShow
