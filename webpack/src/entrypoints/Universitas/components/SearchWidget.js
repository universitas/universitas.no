import { connect } from 'react-redux'
import { getMenu, searchQuery } from 'ducks/menu'
import { getFeed } from 'ducks/newsFeed'
import { Search, Sync } from 'components/Icons'
import cx from 'classnames'

const Icon = ({ fetching }) => (
  <div className={cx('Icon', { fetching })}>
    {fetching ? <Sync /> : <Search />}
  </div>
)

const SearchWidget = ({ search = '', searchQuery, fetching }) => (
  <div className={cx('SearchWidget')}>
    <Icon fetching={fetching} />
    <input
      onChange={e => searchQuery(e.target.value)}
      type="text"
      placeholder="søk..."
      value={search}
    />
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  ...getMenu(state),
  ...getFeed(state),
})
const mapDispatchToProps = { searchQuery }
export default connect(mapStateToProps, mapDispatchToProps)(SearchWidget)
