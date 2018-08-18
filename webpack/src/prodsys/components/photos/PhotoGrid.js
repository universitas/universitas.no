import cx from 'classnames'
import { connect } from 'react-redux'
import Thumb from 'components/Thumb'
import { PhotoStats } from '.'
import { actions, selectors } from './model.js'

const MODEL = 'photos'

const GridItem = ({ pk, onClick, small, className, ...data }) => (
  <div key={pk} onClick={onClick} className={className}>
    <Thumb src={small} title={data.filename} />
    <PhotoStats pk={pk} {...data} />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const selected = selectors.getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx('GridItem', { dirty, selected })
    return { ...data, className, model: MODEL }
  },
  (dispatch, { clickAction }) => ({ onClick: e => dispatch(clickAction) }),
)(GridItem)

const PhotoGrid = ({
  items = [],
  clickHandler = id => actions.reverseUrl({ id }),
}) => (
  <div className="ItemGrid">
    {items.map(pk => (
      <ConnectedGridItem clickAction={clickHandler(pk)} key={pk} pk={pk} />
    ))}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  PhotoGrid,
)
