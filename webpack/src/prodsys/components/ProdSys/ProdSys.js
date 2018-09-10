import { IssueList, IssueDetail } from 'components/issues'
import { ContributorList, ContributorDetail } from 'components/contributors'
import { PhotoList, PhotoDetail } from 'components/photos'
import { UploadList } from 'components/upload'
import { StoryList, StoryDetail } from 'components/stories'
import { FrontpageList, FrontpageDetail } from 'components/frontpage'
import RavenBoundary from 'components/RavenBoundary'
import MainToolBar from 'components/MainToolBar.js'

import { connect } from 'react-redux'
import { getRoutePayload } from 'prodsys/ducks/router'

const Pane = ({ children, ...props }) => (
  <section className="Panel" {...props}>
    <RavenBoundary>{children}</RavenBoundary>
  </section>
)

const ListPane = connect(getRoutePayload)(({ pk, model, action }) => {
  const list = {
    stories: StoryList,
    issues: IssueList,
    photos: PhotoList,
    uploads: UploadList,
    contributors: ContributorList,
    frontpage: FrontpageList,
  }
  if (model == 'stories' && action == 'images')
    return (
      <Pane key={model}>
        <StoryList action={action} />
        <PhotoList action={action} />
      </Pane>
    )

  const List = list[model] || (() => `list: ${model}`)

  return (
    <Pane key={model}>
      <List action={action} />
    </Pane>
  )
})

const DetailPane = connect(getRoutePayload)(({ pk, model, action }) => {
  const detail = {
    stories: StoryDetail,
    issues: IssueDetail,
    photos: PhotoDetail,
    contributors: ContributorDetail,
    frontpage: FrontpageDetail,
  }
  const Detail = detail[model] || (() => '??detail??')
  if (model == 'frontpage')
    return (
      <Pane style={{ maxWidth: '30rem' }}>
        <Detail pk={pk} action={action} />
      </Pane>
    )
  if (pk)
    return (
      <Pane>
        <Detail pk={pk} action={action} />
      </Pane>
    )
  return null
})

const Prodsys = () => (
  <main className="ProdSys">
    <MainToolBar />
    <ListPane />
    <DetailPane />
  </main>
)

export default Prodsys
