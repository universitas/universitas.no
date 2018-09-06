import Navigation from 'components/Navigation'
import SearchField from 'components/SearchField'
import Filter from 'components/Filter'

const ListPanel = ({ model, filters = [], children, ...props }) => {
  return (
    <section className="ListPanel">
      <div className="TopBar">
        <div className="Filters">
          {filters.map((props, index) => <Filter key={index} {...props} />)}
          <SearchField label="søk..." attr="search" model={model} />
        </div>
      </div>
      <section className="itemList" {...props}>
        {children}
      </section>
      <div className="BottomBar">
        <Navigation model={model} />
      </div>
    </section>
  )
}

export default ListPanel
