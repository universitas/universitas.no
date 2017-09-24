// Choice field
// display name from list of choices
export const getDisplayName = value =>
  R.compose(R.propOr(value, 'display_name'), R.find(R.propEq('value', value)))

export const DetailField = ({ choices, value, ...args }) => (
  <span {...args}>{getDisplayName(value)(choices)}</span>
)

export const EditableField = ({ choices, value, ...args }) => (
  <select value={value} {...args}>
    {choices.map(({ value, display_name }) => (
      <option key={value} value={value}> {display_name} </option>
    ))}
  </select>
)
