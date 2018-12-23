import StoryRoute from 'components/stories'
import PhotoRoute from 'components/photos'
import UploadRoute from 'components/upload'
import ContributorRoute from 'components/contributors'
import IssueRoute from 'components/issues'
import FrontPageRoute from 'components/frontpage'
import MainToolBar from 'components/MainToolBar.js'

import { connect } from 'react-redux'
import { getRoutePayload } from 'prodsys/ducks/router'

const ModelRoute = connect(getRoutePayload)(({ pk, model, action }) => {
  const Route = {
    stories: StoryRoute,
    photos: PhotoRoute,
    uploads: UploadRoute,
    issues: IssueRoute,
    contributors: ContributorRoute,
    frontpage: FrontPageRoute,
  }[model]
  if (!Route) return `the route ${model} is missing`
  return <Route pk={pk} action={action} />
})

const Prodsys = () => (
  <main className="ProdSys">
    <MainToolBar />
    <ModelRoute />
  </main>
)

export default Prodsys
