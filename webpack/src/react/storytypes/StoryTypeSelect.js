import { connect } from 'react-redux'
import { getStoryTypeList } from 'storytypes/duck'

const ChoiceField = ({ choices, value, editable, ...args }) =>
  editable
    ? <select value={value} {...args}>
        {choices.map(({ value, display_name }) => (
          <option key={value} value={value}> {display_name} </option>
        ))}
      </select>
    : <span>{value}</span>

const StoryTypeSelect = ({ items, dispatch, ...args }) => (
  <ChoiceField
    choices={items.map(({ id, name }) => ({ value: id, display_name: name }))}
    {...args}
  />
)

export default connect(
  state => ({
    items: getStoryTypeList(state),
  }),
  null
)(StoryTypeSelect)
