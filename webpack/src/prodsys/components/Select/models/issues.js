export const processOptions = R.pipe(
  R.map(({ issue_name, ...item }) => ({ label: issue_name, ...item })),
  R.sortBy(R.descend(R.prop('label'))),
  R.groupBy(R.prop('year')),
  R.toPairs,
  R.map(([label, options]) => ({ label, options })),
)
