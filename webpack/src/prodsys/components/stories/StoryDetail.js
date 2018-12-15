import DetailPanel from 'components/DetailPanel'
import cx from 'classnames'
import { modelSelectors } from 'ducks/basemodel'
import StoryDetailImages from './StoryDetailImages.js'
import StoryDetailText from './StoryDetailText.js'
import StoryDetailPreview from './StoryDetailPreview.js'
import { selectors, MODEL } from './model.js'
import { ZoomControl } from 'components/PreviewIframe'
import Debug from 'components/Debug'

const StoryAction = ({ action, ...props }) => {
  if (action == 'change') return <StoryDetailText {...props} />
  if (action == 'images') return <StoryDetailImages {...props} />
  if (action == 'preview') return <StoryDetailPreview {...props} />
}

const StoryDetail = ({ panes, pk, action, ...props }) => (
  <DetailPanel
    pk={pk}
    model={MODEL}
    getTitle={({ title, working_title }) => title || working_title}
    className={cx('StoryDetail', `status-${props.publication_status}`)}
    scroll={action == 'images'}
    footer={action == 'preview' && <ZoomControl />}
  >
    <StoryAction pk={pk} action={action} {...props} />
  </DetailPanel>
)

export default StoryDetail
