import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Preview from './Preview'
import './Editor.scss'

const mapStateToProps = ({ text }) => ({
  caret: text.caret,
  content: text.content,
})

const mapDispatchToProps = dispatch => ({
  textChanged: (content, caret) =>
    dispatch(actions.textChanged(content, caret)),
  indexChanged: index => dispatch(actions.editIndexChanged(index)),
})

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
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }
  componentDidUpdate(prevProps) {
    const { content, caret } = this.props
    if (content == prevProps.content) return
    const selectionStart = content.length - caret
    console.log(selectionStart)
    this.textArea.selectionStart = selectionStart
    this.textArea.selectionEnd = selectionStart
  }
  onKeyUp(e) {
    const activeIndex = (e.target.value
      .slice(0, e.target.selectionStart)
      .match(/\n+/g) || []).length
    this.props.indexChanged(activeIndex)
  }
  onChange(e) {
    const { content, textChanged } = this.props
    const newcontent = e.target.value
    const caret = newcontent.length - e.target.selectionStart
    const cleancontent = content.length < newcontent.length
      ? cleanup(newcontent)
      : newcontent
    textChanged(cleancontent, caret)
  }
  render() {
    return (
      <section className="Editor">
        <textArea
          autoCapitalize="sentences"
          lang="no-nn"
          className="TextArea"
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          onMouseUp={this.onKeyUp}
          value={this.props.content}
          ref={el => (this.textArea = el)}
        />
        <Preview />
      </section>
    )
  }
}
Editor = connect(mapStateToProps, mapDispatchToProps)(Editor)

export default Editor
