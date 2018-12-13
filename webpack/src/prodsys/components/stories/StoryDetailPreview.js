import cx from 'classnames'
import { StoryPreview } from 'universitas/components/Story'
import { selectors } from './model'
import { modelSelectors } from 'ducks/basemodel'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import stylesheet from '!css-loader!sass-loader!universitas/styles/universitas.scss'

const getPhoto = modelSelectors('photos').getItem
const getStoryImage = modelSelectors('storyimages').getItem

const inheritStyles = (sourceDoc, targetDoc) => {
  for (const node of sourceDoc.head.children) {
    if (node.tagName == 'LINK' || node.tagName == 'STYLE')
      targetDoc.head.appendChild(node.cloneNode(true))
  }
}

class IFrame extends React.Component {
  constructor(props) {
    super(props)
    this.ref = el => el && (this.doc = el.contentDocument)
  }
  componentDidMount() {
    inheritStyles(document, this.doc)
    this.forceUpdate() // create portals after initial render
  }
  render() {
    const { children, head, ...props } = this.props
    return (
      <iframe ref={this.ref} {...props}>
        {this.doc && ReactDOM.createPortal(children, this.doc.body)}
        {this.doc && head && ReactDOM.createPortal(head, this.doc.head)}
      </iframe>
    )
  }
}

const head = <style>{stylesheet}</style>
const StoryDetailPreview = props => {
  return (
    <IFrame style={{ height: '100%' }}>
      <StoryPreview {...props} />
    </IFrame>
  )
  return (
    <section className="itemList" style={{ padding: '1rem' }}>
      <StoryPreview {...props} />
    </section>
  )
}

const mapStateToProps = (state, { pk }) => {
  const story = selectors.getItem(pk)(state)
  let images = []
  if (story.images) {
    images = story.images.map(image => ({
      ...image,
      ...getPhoto(image.imagefile)(state),
      ...getStoryImage(image.id)(state),
    }))
  }
  return { ...story, images }
}

export default connect(mapStateToProps)(StoryDetailPreview)
