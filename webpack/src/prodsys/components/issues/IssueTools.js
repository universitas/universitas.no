import { connect } from 'react-redux'
import { Tool, PermissionTool } from 'components/tool'
import { MODEL, selectors, actions } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const openUrl = url => () => window.open(url)

const IssueTools = ({ pk, action, create, trash, pdfs = [] }) => (
  <ModelTools>
    <PermissionTool
      disabled={action == 'create'}
      icon="Add"
      label="ny"
      title="legg til ny utgave"
      onClick={create}
      permission="add issue"
    />
    <PermissionTool
      label="slett"
      title={
        pk && pdfs.length == 0
          ? 'slett utgaven'
          : pdfs.length
          ? 'kan ikke slette denne'
          : 'velg en utgave'
      }
      onClick={trash}
      disabled={!pk || pdfs.length}
      icon="Delete"
      permission="delete issue"
    />
    <Tool
      icon="Newspaper"
      title={'pdf-arkivet på universitas.no'}
      label="forside"
      onClick={() => window.open('/pdf/')}
      order={5}
    />
    <OpenInDjangoAdmin pk={pk} path="issues/issue" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  create: () => dispatch(toRoute({ model: MODEL, action: 'create' })),
  trash: () => {
    dispatch(actions.itemDeleted(pk))
    dispatch(toRoute({ model: MODEL }))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssueTools)
