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

const getTitle = ({ title, working_title }) => title || working_title
const getClass = ({ publication_status }) =>
  cx('StoryDetail', `status-${publication_status}`)

const StoryDetail = ({ panes, pk, action }) => (
  <DetailPanel
    pk={pk}
    model={MODEL}
    getTitle={getTitle}
    getClass={getClass}
    scroll={action == 'images'}
    header={action == 'preview' && <ZoomControl />}
  >
    <StoryAction pk={pk} action={action} />
  </DetailPanel>
)

export default StoryDetail
