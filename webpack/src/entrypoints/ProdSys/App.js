import { Fragment as RouterFragment, push } from 'redux-little-router'
import { connect } from 'react-redux'
import IssueList from 'issues/IssueList'
import IssueDetail from 'issues/IssueDetail'
import ContributorList from 'contributors/ContributorList'
import ContributorDetail from 'contributors/ContributorDetail'
import PhotoList from 'photos/PhotoList'
import PhotoDetail from 'photos/PhotoDetail'
import UploadList from 'fileupload/UploadList'
import StoryList from 'stories/StoryList'
import StoryDetail from 'stories/StoryDetail'
import UserTool from 'components/UserTool'
import Tool from 'components/Tool'
import ToolBar from 'components/ToolBar'
import ErrorTool from 'components/ErrorTool'
import LoginForm from 'components/LoginForm'
import RavenBoundary from 'components/RavenBoundary'
import { getUser } from 'ducks/auth'
import { assignPhoto } from 'ducks/storyimage'
import 'styles/prodsys.scss'

const Home = () => <div>home</div>
const Fragment = ({ children, ...props }) => (
  <RouterFragment {...props}>
    <RavenBoundary>{children}</RavenBoundary>
  </RouterFragment>
)

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

const Panel = ({ children }) => <section className="Panel">{children}</section>

const ProdSys = () => (
  <main className="ProdSys">
    <MainToolBar />
    <Panel>
      <Fragment forRoute="/stories">
        <StoryList />
      </Fragment>
      <Fragment forRoute="/stories/:id/images">
        <PhotoList clickHandler={assignPhoto} />
      </Fragment>
      <Fragment forRoute="/issues">
        <IssueList />
      </Fragment>
      <Fragment forRoute="/contributors">
        <ContributorList />
      </Fragment>
      <Fragment forRoute="/photos">
        <PhotoList />
      </Fragment>
      <Fragment forRoute="/upload">
        <UploadList />
      </Fragment>
    </Panel>
    <Fragment forRoute="/photos/:id">
      <PhotoDetail />
    </Fragment>
    <Fragment forRoute="/contributors/:id">
      <ContributorDetail />
    </Fragment>
    <Fragment forRoute="/storyimages/:id">
      <StoryDetail />
    </Fragment>
    <Fragment forRoute="/stories/:id">
      <StoryDetail />
    </Fragment>
    <Fragment forRoute="/issues/:id">
      <IssueDetail />
    </Fragment>
  </main>
)
const App = ({ username, pending }) =>
  pending ? null : username ? <ProdSys /> : <LoginForm />

const mapDispatchToProps = dispatch => ({})

export default connect(getUser, mapDispatchToProps)(App)
