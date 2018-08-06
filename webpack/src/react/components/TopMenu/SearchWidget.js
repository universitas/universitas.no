import { connect } from 'react-redux'
import { changeSearch, getFeed } from 'ducks/newsFeed'
import { Search, Sync } from 'components/Icons'
import cx from 'classnames'

const Icon = ({ fetching }) => (
  <div className={cx('Icon', { fetching })}>
    {fetching ? <Sync /> : <Search />}
  </div>
)

const SearchWidget = ({
  search = '',
  changeSearch,
  fetching,
  autoFocus = false,
}) => (
  <div className={cx('SearchWidget')}>
    <Icon fetching={fetching} />
    <input
      autoFocus={autoFocus}
      onChange={e => changeSearch(e.target.value)}
      type="text"
      placeholder="søk..."
      value={search}
    />
  </div>
)

const mapStateToProps = getFeed
const mapDispatchToProps = { changeSearch }
export default connect(mapStateToProps, mapDispatchToProps)(SearchWidget)
