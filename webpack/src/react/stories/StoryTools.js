import { connect } from 'react-redux'
import { Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { push } from 'redux-little-router'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const model = 'stories'
const { fieldChanged, itemCloned, itemDeSelected } = modelActions(model)
const { getItem } = modelSelectors(model)

const openUrl = url => () => window.open(url)

const Tool = ({ Icon, ...props }) => (
  <div className="Tool" {...props}>
    <Icon />
  </div>
)

const ToolBar = props => <div {...props} />

const StoryTools = ({
  trashStory,
  cloneStory,
  closeStory,
  edit_url,
  public_url,
}) => (
  <ToolBar className="StoryTools">
    <Tool Icon={Close} title="lukk saken" onClick={closeStory} />
    <Tool Icon={Add} title="kopier saken" onClick={cloneStory} />
    <Tool Icon={Delete} title="slett saken" onClick={trashStory} />
    <Tool
      Icon={Laptop}
      title="se saken på universitas.no"
      onClick={openUrl(public_url)}
    />
    <Tool
      Icon={Tune}
      title="rediger i django-admin"
      onClick={openUrl(edit_url)}
    />
  </ToolBar>
)

const mapStateToProps = (state, { pk }) => getItem(pk)

const mapDispatchToProps = (dispatch, { pk }) => ({
  trashStory: () => dispatch(fieldChanged(pk, 'publication_status', 15)),
  closeStory: () => dispatch(push('/stories')),
  cloneStory: () => dispatch(itemCloned(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)
