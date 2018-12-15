import Pagination from './Pagination'
import SearchField from './SearchField'
import Filter from './Filter'
import Panel from 'components/Panel'

const ListPanel = ({ model, filters = [], children, ...props }) => {
  return (
    <Panel
      {...props}
      className="ListPanel"
      header={
        <>
          <div className="Filters">
            {filters.map((props, index) => (
              <Filter key={index} {...props} />
            ))}
          </div>
          <SearchField label="søk..." attr="search" model={model} />
        </>
      }
      footer={<Pagination model={model} />}
    >
      <section className="itemList">{children}</section>
    </Panel>
  )
}

export default ListPanel
