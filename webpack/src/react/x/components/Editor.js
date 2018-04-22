import { connect } from 'react-redux'
import { textChanged, moveCaret } from 'x/ducks/editor'
import EditorToolBar from 'x/components/EditorToolBar'
import * as Icon from 'components/Icons'

const cleanup = text => {
  return text
    .replace(/^(@\S+:)/gm, s => s.toLowerCase())
    .replace(/^ *(@\S+:) *\b/gm, '$1 ')
    .replace(/^@t: */gm, '@txt: ')
    .replace(/«([^"»«]*)"/g, '«$1»')
    .replace(/"/g, '«')
    .replace(/--/g, '–')
    .replace(/^[-–] *\b/gm, '– ')
    .replace(/^@text:/gm, '@txt:')
    .replace(/\n+@m$/gm, '\n\n@mt: ')
    .replace(/^./gm, s => s.toUpperCase())
}

class Editor extends React.Component {
  onChange = e => {
    let newContent = e.target.value
    const { content, moveCaret, textChanged } = this.props
    if (content.length < newContent.length) newContent = cleanup(newContent)
    textChanged(newContent)
  }
  setCaretPosition = position => {
    this.textArea.selectionEnd = position
    this.textArea.selectionStart = position
    this.props.moveCaret(position)
  }
  componentDidUpdate(prevProps) {
    const { content, caret } = this.props
    const change = content.length - prevProps.content.length
    if (change !== 0) this.setCaretPosition(caret + change)
  }
  render() {
    const moveCaret = e => this.props.moveCaret(e.target.selectionStart)
    return (
      <section className="Editor">
        <EditorToolBar />
        <textarea
          className="TextArea"
          autoCapitalize="sentences"
          lang="no-nn"
          onChange={this.onChange}
          onKeyUp={moveCaret}
          onMouseUp={moveCaret}
          value={this.props.content}
          ref={el => (this.textArea = el)}
        />
      </section>
    )
  }
}

const mapStateToProps = ({ editor: { caret, content } }) => ({
  caret,
  content,
})

const mapDispatchToProps = { textChanged, moveCaret }

Editor = connect(mapStateToProps, mapDispatchToProps)(Editor)

export default Editor
