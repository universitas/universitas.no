export const itemsToOptions = R.pipe(
  R.values,
  R.map(({ title, working_title, id }) => ({
    label: title || working_title,
    id,
  })),
)
