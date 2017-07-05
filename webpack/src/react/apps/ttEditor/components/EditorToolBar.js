import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from '../actions'
import ToolBar from '../../../components/ToolBar'

const EditorToolBar = ({ insertText, changeTag, ...props }) => {
  const tools = {
    subheading: {
      icon: 'heading',
      onClick: e => changeTag('mt'),
    },
    question: {
      icon: 'Question',
      onClick: e => changeTag('spm'),
    },
    clear: {
      icon: 'Clear',
      onClick: e => changeTag(''),
    },
    pullquote: {
      icon: 'Quote',
      active: true,
      onClick: e =>
        insertText('\n@sitat: ...\n@sitatbyline: Nomen Nescio, Anonym kilde\n'),
    },
  }
  return <ToolBar className="EditorToolBar" tools={tools} {...props} />
}
EditorToolBar.propTypes = {
  insertText: PropTypes.func.isRequired,
  changeTag: PropTypes.func.isRequired,
}
const mapStateToProps = (state, ownProps) => ({})
const mapDispatchToProps = (dispatch, ownProps) => ({
  insertText: text => dispatch(actions.insertText(text)),
  changeTag: tag => dispatch(actions.changeTag(tag)),
})
export default connect(mapStateToProps, mapDispatchToProps)(EditorToolBar)
