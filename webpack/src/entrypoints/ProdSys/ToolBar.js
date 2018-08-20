import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import { UserTool, Tool, ToolBar, ErrorTool } from 'components/tool'

const AppTool = connect(null, { push })(({ href, push, ...props }) => (
  <Tool onClick={() => push(href)} {...props} />
))

const MainToolBar = () => (
  <section className="SideBar">
    <AppTool href="/stories" icon="Edit" label="saker" />
    <AppTool href="/photos" icon="Camera" label="foto" />
    <AppTool href="/issues" icon="Newspaper" label="ut&shy;gaver" />
    <AppTool href="/contributors" icon="Person" label="personer" />
    <AppTool href="/upload" icon="CameraRoll" label="last opp" />
    <div className="spacer" style={{ flex: 1 }} />
    <ErrorTool />
    <UserTool />
  </section>
)

export default MainToolBar
