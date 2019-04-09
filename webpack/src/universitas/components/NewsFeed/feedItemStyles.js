const prefixMatcher = R.pipe(prefix => [
  prefix,
  R.pipe(
    R.defaultTo(''),
    R.match(RegExp(`${prefix}-(\\w+)`)),
    R.last,
  ),
])

export const parseStyles = R.pipe(
  R.split(' '),
  R.map(prefixMatcher),
  R.fromPairs,
  R.applySpec,
)('size weight bg layout')

export const renderStyles = ({
  size = 'small',
  weight = 'bold',
  bg = 'white',
  layout = 'top',
}) => `size-${size} layout-${layout} bg-${bg} weight-${weight}`
