import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'

const openUrl = url => () => window.open(url)

const ContributorTools = ({ pk }) => (
  <React.Fragment>
    <OpenInDjangoAdmin pk={pk} path="contributors/contributor" />
  </React.Fragment>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ContributorTools)
