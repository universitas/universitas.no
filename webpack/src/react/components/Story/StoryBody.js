const parseLine = line => {
  const tag = R.match(/^@([a-z]+): ?(.*)$/, line)
  if (tag[0]) {
    return { type: tag[1], text: tag[2] }
  }
  return { type: 'txt', text: line }
}
const parse = R.pipe(
  R.split(/\n/),
  R.map(R.trim),
  R.filter(R.length),
  R.tap(console.log),
  R.map(parseLine),
)

const Paragraph = ({ children }) => <p className="Paragraph">{children}</p>
const Question = ({ children }) => <p className="Question">{children}</p>
const Box = ({ children }) => <aside className="Box">{children}</aside>

const Subheading = ({ children }) => <h3 className="Subheading">{children}</h3>
const Tingo = ({ children }) => {
  const parts = R.match(/^(.{15}\S* )(.*)$/, children)
  if (parts[1])
    return (
      <p className="Tingo">
        <strong>{parts[1]}</strong>
        {parts[2]}
      </p>
    )
  else
    return (
      <p className="Tingo">
        <strong>{children}</strong>
      </p>
    )
}

const mapping = {
  mt: Subheading,
  txt: Paragraph,
  box: Box,
  spm: Question,
  tingo: Tingo,
}

const mapTag = ({ type, text }) => {
  console.log(type, text)
  const Component = mapping[type]
  if (Component) return <Component>{text}</Component>
  else
    return (
      <Paragraph>
        @{type}: {text}
      </Paragraph>
    )
}

const StoryBody = ({ bodytext_markup }) => {
  return (
    <main className="StoryBody">{R.map(mapTag, parse(bodytext_markup))}</main>
  )
}

export default StoryBody
