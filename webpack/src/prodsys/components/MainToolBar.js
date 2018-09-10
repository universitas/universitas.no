import { connect } from 'react-redux'
import { getRoute, toRoute } from 'prodsys/ducks/router'
import { UserTool, Tool, ToolBar, ErrorTool } from 'components/tool'
import cx from 'classnames'

const mapStateToProps = getRoute
const mapDispatchToProps = (dispatch, { model }) => ({
  onClick: e => dispatch(toRoute({ model, action: 'list' })),
})

const AppTool = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ icon, label, model, payload, onClick }) => (
  <Tool
    onClick={onClick}
    icon={icon}
    label={label}
    className={cx({ active: model == payload.model })}
  />
))

const MainToolBar = () => (
  <section className="SideBar">
    <AppTool model="stories" icon="Edit" label="saker" />
    <AppTool model="photos" icon="Camera" label="foto" />
    <AppTool model="issues" icon="Newspaper" label="ut&shy;gaver" />
    <AppTool model="contributors" icon="Person" label="per&shy;soner" />
    <AppTool model="uploads" icon="CameraRoll" label="last opp" />
    <AppTool model="frontpage" icon="GridView" label="for&shy;side" />
    <div className="spacer" style={{ flex: 1 }} />
    <ErrorTool />
    <UserTool />
  </section>
)

export default MainToolBar
