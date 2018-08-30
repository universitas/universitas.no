export const reshape = props => ({ ...props, label: props.name })
export const reshapeOptions = R.pipe(
  R.groupBy(R.prop('section')),
  R.toPairs,
  R.map(([label, options]) => ({ label, options })),
)
