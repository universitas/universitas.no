const splitter = n => {
  const re = RegExp(`^([^\\n:?!.]{0,${n}}\\S*)(.*)$`)
  return R.pipe(
    t => re.exec(t),
    R.tail,
  )
}

const splitTingo = R.curry(split =>
  R.pipe(
    R.unless(R.is(Array), R.of),
    R.over(R.lensIndex(0), R.when(R.is(String), split)),
    R.flatten,
    R.filter(Boolean),
  ),
)

const Tingo = ({ children, length = 15 }) => {
  const [first, ...rest] = splitTingo(splitter(length))(children)
  return (
    <p className="Tingo">
      <strong>{first}</strong>
      {rest || null}
    </p>
  )
}

export default Tingo
