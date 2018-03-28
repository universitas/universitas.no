import Navigation from 'components/Navigation'
import SearchField from 'components/SearchField'
import Filter from 'components/Filter'
import cx from 'classnames'
import { scrollTo } from 'utils/scroll'

import 'styles/listpanel.scss'

const ListPanel = ({ model, filters = [], children = [] }) => {
  return (
    <section className="ListPanel">
      <div className="TopBar">
        <div className="Filters">
          {filters.map((props, index) => <Filter key={index} {...props} />)}
          <SearchField label="søk..." attr="search" model={model} />
        </div>
      </div>
      <section className="itemList">{children}</section>
      <div className="BottomBar">
        <Navigation model={model} />
      </div>
    </section>
  )
}

export default ListPanel
