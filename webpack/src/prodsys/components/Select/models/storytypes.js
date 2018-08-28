export const itemsToOptions = R.pipe(
  R.values,
  R.groupBy(R.prop('section')),
  R.toPairs,
  R.map(([label, options]) => ({ label, options })),
)
