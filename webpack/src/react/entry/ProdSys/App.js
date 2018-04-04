import { Fragment, push } from 'redux-little-router'
import { Camera, Person, Newspaper, Edit } from 'components/Icons'
import { connect } from 'react-redux'
import IssueList from 'issues/IssueList'
import IssueDetail from 'issues/IssueDetail'
import ContributorList from 'contributors/ContributorList'
import ContributorDetail from 'contributors/ContributorDetail'
import PhotoList from 'images/PhotoList'
import PhotoDetail from 'images/PhotoDetail'
import StoryList from 'stories/StoryList'
import StoryDetail from 'stories/StoryDetail'
import UserTool from 'components/UserTool'
import Tool from 'components/Tool'
import ToolBar from 'components/ToolBar'
import ErrorTool from 'components/ErrorTool'
import LoginForm from 'components/LoginForm'
import { getUser } from 'ducks/auth'
import 'styles/prodsys.scss'

const Home = () => <div>home</div>

const AppTool = connect(null, { push })(({ href, push, ...props }) => (
  <Tool onClick={() => push(href)} {...props} />
))

const MainToolBar = () => (
  <section className="SideBar">
    <AppTool href="/stories" icon="Edit" label="saker" />
    <AppTool href="/images" icon="Camera" label="foto" />
    <AppTool href="/issues" icon="Newspaper" label="utgaver" />
    <AppTool href="/contributors" icon="Person" label="bidragsytere" />
    <div className="spacer" style={{ flex: 1 }} />
    <ErrorTool />
    <UserTool />
  </section>
)

const ProdSys = () => (
  <main className="ProdSys">
    <MainToolBar />
    <Fragment forRoute="/stories">
      <StoryList />
    </Fragment>
    <Fragment forRoute="/issues">
      <IssueList />
    </Fragment>
    <Fragment forRoute="/contributors">
      <ContributorList />
    </Fragment>
    <Fragment forRoute="/images">
      <PhotoList />
    </Fragment>
    <Fragment forRoute="/stories/:id">
      <StoryDetail />
    </Fragment>
    <Fragment forRoute="/contributors/:id">
      <ContributorDetail />
    </Fragment>
    <Fragment forRoute="/issues/:id">
      <IssueDetail />
    </Fragment>
    <Fragment forRoute="/images/:id">
      <PhotoDetail />
    </Fragment>
  </main>
)
const App = ({ username, pending }) =>
  pending ? null : username ? <ProdSys /> : <LoginForm />

const mapDispatchToProps = dispatch => ({})

export default connect(getUser, mapDispatchToProps)(App)
