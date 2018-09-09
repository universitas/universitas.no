import { Fragment as RouterFragment, push } from 'redux-little-router'
import { IssueList, IssueDetail } from 'components/issues'
import { ContributorList, ContributorDetail } from 'components/contributors'
import { PhotoList, PhotoDetail } from 'components/photos'
import { UploadList } from 'components/upload'
import { StoryList, StoryDetail } from 'components/stories'
import { FrontpageList, FrontpageDetail } from 'components/frontpage'
import RavenBoundary from 'components/RavenBoundary'
import { assignPhoto } from 'ducks/storyimage'
import MainToolBar from 'components/ToolBar.js'

const Panel = ({ children }) => <section className="Panel">{children}</section>

const Fragment = ({ children, ...props }) => (
  <RouterFragment {...props}>
    <RavenBoundary>{children}</RavenBoundary>
  </RouterFragment>
)

const Prodsys = () => (
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
      <Fragment forRoute="/frontpage">
        <FrontpageList />
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
    <Fragment forRoute="/frontpage">
      <FrontpageDetail />
    </Fragment>
  </main>
)

export default Prodsys
