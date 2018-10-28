import cx from 'classnames'
import { StoryPreview } from 'universitas/components/Story'
import { selectors } from './model'
import { connect } from 'react-redux'

const StoryDetailPreview = props => {
  return (
    <div className="panelContent">
      <StoryPreview {...props} />
    </div>
  )
}
const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
export default connect(mapStateToProps)(StoryDetailPreview)
