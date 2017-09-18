import { Fragment, Link } from 'redux-little-router'
import { Camera, Person, Newspaper, Edit } from 'components/Icons'
import { connect } from 'react-redux'
import IssueList from 'issues/IssueList'
import IssueDetail from 'issues/IssueDetail'
import ContributorList from 'contributors/ContributorList'
import ContributorDetail from 'contributors/ContributorDetail'
import PhotoList from 'photos/PhotoList'
import PhotoDetail from 'photos/PhotoDetail'
import StoryList from 'stories/StoryList'
import StoryDetail from 'stories/StoryDetail'
import UserTool from 'auth/UserTool'
import ErrorTool from 'error/ErrorTool'
import LoginForm from 'auth/LoginForm'
import { getUser } from 'auth/duck'
import 'styles/prodsys.scss'

const Home = () => <div>home</div>

// activeProps={{ className: 'AppButton active' }}
const AppButton = ({ href, Icon, label }) => (
  <Link className="AppButton" href={href}>
    <Icon /><small>{label}</small>
  </Link>
)
AppButton.propTypes = {
  Icon: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

const ProdSys = () => (
  <main className="ProdSys">
    <section className="SideBar">
      <AppButton href="/stories" Icon={Edit} label="saker" />
      <AppButton href="/images" Icon={Camera} label="foto" />
      <AppButton href="/issues" Icon={Newspaper} label="utgaver" />
      <AppButton href="/contributors" Icon={Person} label="bidragsytere" />
      <div className="spacer" style={{ flex: 1 }} />
      <ErrorTool />
      <UserTool />
    </section>
    <section className="ListPanel">
      <Fragment forRoute="/stories"><StoryList /></Fragment>
      <Fragment forRoute="/issues"><IssueList /></Fragment>
      <Fragment forRoute="/contributors"><ContributorList /></Fragment>
      <Fragment forRoute="/images"><PhotoList /></Fragment>
    </section>
    <Fragment forRoute="/stories/:id">
      <section className="DetailPanel"> <StoryDetail /> </section>
    </Fragment>
    <Fragment forRoute="/contributors/:id">
      <section className="DetailPanel"> <ContributorDetail /> </section>
    </Fragment>
    <Fragment forRoute="/issues/:id">
      <section className="DetailPanel"> <IssueDetail /> </section>
    </Fragment>
    <Fragment forRoute="/images/:id">
      <section className="DetailPanel"> <PhotoDetail /> </section>
    </Fragment>
  </main>
)
const App = ({ username, pending }) =>
  pending ? null : username ? <ProdSys /> : <LoginForm />

export default connect(getUser)(App)
