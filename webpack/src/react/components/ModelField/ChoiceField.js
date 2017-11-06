// Choice field
// display name from list of choices

// string comparison – in case value or prop is number
const stringEq = R.curry((a, b) => String(a) == String(b))

export const getDisplayName = value =>
  R.compose(
    R.propOr(value, 'display_name'),
    R.find(R.propSatisfies(stringEq(value), 'value'))
  )

export const DetailField = ({ choices, value, ...args }) => (
  <span {...args}>{getDisplayName(value)(choices)}</span>
)

export const EditableField = ({ choices, value, ...args }) => (
  <select value={value} {...args}>
    {choices.map(({ value, display_name }) => (
      <option key={value} value={value}>
        {display_name}
      </option>
    ))}
  </select>
)
