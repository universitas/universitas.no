import 'styles/storylist.scss'
import cx from 'classnames'
import { connect } from 'react-redux'
import { detailFields as fields } from 'photos/model'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import PhotoStats from 'components/PhotoStats'
import ModelField from 'components/ModelField'
import Thumb from 'components/Thumb'

const MODEL = 'photos'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)
const { reverseUrl } = modelActions(MODEL)

const GridItem = ({ pk, onClick, small, className, ...data }) => (
  <div key={pk} onClick={onClick} className={className}>
    <Thumb src={small} title={data.filename} />
    <PhotoStats pk={pk} {...data} />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = getItem(pk)(state) || {}
    const selected = getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx('GridItem', { dirty, selected })
    return { ...data, className, model: MODEL }
  },
  (dispatch, { clickAction }) => ({ onClick: e => dispatch(clickAction) })
)(GridItem)

const PhotoGrid = ({ items = [], clickHandler = id => reverseUrl({ id }) }) => (
  <div className="ItemGrid">
    {items.map(pk => (
      <ConnectedGridItem clickAction={clickHandler(pk)} key={pk} pk={pk} />
    ))}
  </div>
)
export default connect(state => ({ items: getItemList(state) }))(PhotoGrid)
