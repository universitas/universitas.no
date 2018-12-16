import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const openUrl = url => () => window.open(url)

const ContributorTools = ({ pk }) => (
  <ModelTools>
    <OpenInDjangoAdmin pk={pk} path="contributors/contributor" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContributorTools)
