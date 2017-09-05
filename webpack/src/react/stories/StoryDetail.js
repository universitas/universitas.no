import { connect } from 'react-redux'
import {
  getCurrentStory,
  fieldChanged,
  storyCloned,
  storyDeSelected,
} from 'stories/duck'
import { detailFields as fields } from 'stories/model'
import DetailField from './DetailField'
import { Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { push } from 'redux-little-router'

const Tool = ({ Icon, ...props }) => (
  <div className="Tool" {...props}>
    <Icon />
  </div>
)

const log = msg => () => alert(msg)
const openUrl = url => () => window.open(url)

let StoryDetailTools = ({
  trashStory,
  cloneStory,
  closeStory,
  edit_url,
  public_url,
}) => (
  <div className="StoryDetailTools">
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
  </div>
)
StoryDetailTools = connect(null, (dispatch, props) => ({
  trashStory: () => dispatch(fieldChanged(props.id, 'publication_status', 15)),
  closeStory: () => dispatch(push('/stories')),
  cloneStory: () => dispatch(storyCloned(props.id)),
}))(StoryDetailTools)

const Detail = ({ fieldChanged, dirty, ...data }) =>
  data.id
    ? <div className="wrapper">
        <StoryDetailTools {...data} />
        <div className="fields">
          {fields.map(({ key, ...args }) => (
            <DetailField
              key={key}
              name={key}
              value={data[key]}
              onChange={e => fieldChanged(data.id, key, e.target.value)}
              {...args}
            />
          ))}
        </div>
      </div>
    : <div> ... </div>

export default connect(getCurrentStory, { fieldChanged })(Detail)
