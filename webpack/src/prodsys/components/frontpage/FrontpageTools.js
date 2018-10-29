import { connect } from 'react-redux'
import DetailTopBar from 'components/DetailTopBar'
import { Tool } from 'components/tool'
import { MODEL, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'

const ToolBar = props => <div {...props} />

const FrontpageTools = ({ pk }) => (
  <React.Fragment>
    <Tool
      icon="Newspaper"
      title={'forsiden'}
      onClick={() => window.open('/')}
    />
    <OpenInDjangoAdmin pk={pk} path="frontpage/frontpagestory" />
  </React.Fragment>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(FrontpageTools)
