import { IssueList, IssueDetail, IssueTools } from 'components/issues'
import {
  ContributorList,
  ContributorDetail,
  ContributorTools,
} from 'components/contributors'
import { PhotoList, PhotoDetail, PhotoTools } from 'components/photos'
import { UploadList } from 'components/upload'
import { StoryList, StoryDetail, StoryTools } from 'components/stories'
import {
  FrontpageList,
  FrontpageDetail,
  FrontpageTools,
} from 'components/frontpage'
import ProdsysErrorBoundary from 'components/ProdsysErrorBoundary'
import MainToolBar from 'components/MainToolBar.js'

import { connect } from 'react-redux'
import { getRoutePayload } from 'prodsys/ducks/router'

const Pane = ({ children, ...props }) => (
  <section className="Panel" {...props}>
    <ProdsysErrorBoundary>{children}</ProdsysErrorBoundary>
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
const ModelTools = connect(getRoutePayload)(({ pk, model, action }) => {
  const tools = {
    stories: StoryTools,
    issues: IssueTools,
    photos: PhotoTools,
    contributors: ContributorTools,
    frontpage: FrontpageTools,
  }
  const Tools = tools[model] || (() => null)

  return (
    <section className="SideBar">
      <Tools pk={pk} action={action} />
    </section>
  )
})

const Prodsys = () => (
  <main className="ProdSys">
    <MainToolBar />
    <ListPane />
    <DetailPane />
    <ModelTools />
  </main>
)

export default Prodsys
