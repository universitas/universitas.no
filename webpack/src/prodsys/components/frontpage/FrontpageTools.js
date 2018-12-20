import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { MODEL, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const ToolBar = props => <div {...props} />

const FrontpageTools = ({ pk }) => (
  <ModelTools>
    <Tool
      icon="Newspaper"
      title={'forsiden'}
      label="forside"
      onClick={() => window.open('/')}
      order={5}
    />
    <OpenInDjangoAdmin pk={pk} path="frontpage/frontpagestory" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FrontpageTools)
