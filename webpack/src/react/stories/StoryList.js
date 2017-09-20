import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { listFields } from 'stories/model'
import SearchField from 'components/SearchField'
import Navigation from 'components/Navigation'
import Filter from 'components/Filter'
import ModelField from 'components/ModelField'
import StoryTable from 'stories/StoryTable'

const MODEL = 'stories'

const filters = listFields
  .filter(el => el.key === 'publication_status')[0]
  .choices.map(({ value, display_name }) => ({
    value: parseInt(value),
    label: display_name,
    toggle: true,
    attr: 'publication_status__in',
    model: MODEL,
  }))
  .filter(choice => choice.value < 10 || choice.value === 100)

filters.push({
  attr: 'publication_status__in',
  model: MODEL,
  value: [],
  label: <Clear />,
})

const StoryList = ({ model = MODEL }) => {
  return (
    <div className="StoryList">
      <div className="ListBar">
        <div className="Filters">
          {filters.map((props, index) => <Filter key={index} {...props} />)}
          <SearchField label="søk..." attr="search" model={model} />
        </div>
      </div>
      <StoryTable />
      <div className="ListBar">
        <Navigation model={model} />
      </div>
    </div>
  )
}
export default StoryList
