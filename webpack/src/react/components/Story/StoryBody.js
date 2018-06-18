import { toJson } from 'utils/text'

const Paragraph = ({ children }) => <p className="Paragraph">{children}</p>
const Question = ({ children }) => <p className="Question">{children}</p>
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

const StoryBody = ({ nodeTree = {}, links = [] }) => {
  return (
    <main
      className="StoryBody"
      style={{
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        lineHeight: 1.1,
        whiteSpace: 'pre-wrap',
      }}
    >
      {links && toJson(links)}
      {'\n'}
      {toJson(nodeTree)}
    </main>
  )
}

export default StoryBody
