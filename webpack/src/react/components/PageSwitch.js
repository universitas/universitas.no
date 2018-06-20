import { withErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
  HOME,
  SECTION,
  STORY,
  SHORT_URL,
  PDF,
  SCHEDULE,
  ABOUT,
  AD_INFO,
  NOT_FOUND,
  getLocation,
} from 'ducks/router'
import { getSearch } from 'ducks/newsFeed'
import { NewsFeed, SearchFeed } from 'components/NewsFeed'
import StoryPage from 'components/Story'
import PDFArchive from 'components/Pages/PDFArchive'
import PublicationSchedule from 'components/Pages/PublicationSchedule'
import AboutUniversitas from 'components/Pages/AboutUniversitas'
import AdvertiserInfo from 'components/Pages/AdvertiserInfo'
import PageNotFound from 'components/PageNotFound'

const captitalize = str => str.replace(/./, R.toUpper)

const PageHelmet = ({
  pageTitle = '',
  lede = 'Norges største studentavis',
  language = 'nb',
}) =>
  pageTitle ? (
    <Helmet>
      <title>{`${pageTitle} | universitas.no`}</title>
      <link rel="canonical" href={global.location.href} />
      <meta name="description" content={lede} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={lede} />
      <meta property="og:locale" content={language} />
    </Helmet>
  ) : null

const pageWrapper = (Page, toTitle = R.F) => {
  const PageComponent = withErrorBoundary(Page)
  const pageTitle = R.pipe(
    toTitle,
    R.unless(R.is(String), R.always('')),
    R.trim,
    captitalize,
  )
  return R.pipe(
    R.converge(R.assoc('pageTitle'), [pageTitle, R.identity]),
    props => [
      <PageHelmet key="head" {...props} />,
      <PageComponent key="body" {...props} />,
    ],
  )
}

const pages = {
  [HOME]: pageWrapper(NewsFeed, R.always('Forsiden')),
  [SECTION]: pageWrapper(NewsFeed, R.prop('section')),
  [STORY]: pageWrapper(StoryPage, R.prop('title')),
  [SHORT_URL]: pageWrapper(StoryPage, R.prop('id')),
  [PDF]: pageWrapper(PDFArchive, ({ year = '' }) => `PDF-arkiv ${year}`),
  [SCHEDULE]: pageWrapper(
    PublicationSchedule,
    ({ year = '' }) => `Utgivelsesplan ${year}`,
  ),
  [ABOUT]: pageWrapper(AboutUniversitas, R.always('Om Universitas')),
  [AD_INFO]: pageWrapper(AdvertiserInfo, R.always('Annonsér i Universitas')),
  [NOT_FOUND]: pageWrapper(PageNotFound, R.always('ikke funnet (404)')),
}

const PageSwitch = ({ location = {}, search = '' }) => {
  const PageComponent = search
    ? SearchFeed
    : pages[location.type] || pages[NOT_FOUND]
  return (
    <main className="Page">
      <PageComponent {...location.payload} pathname={location.pathname} />
    </main>
  )
}

export default connect(
  R.applySpec({ location: getLocation, search: getSearch }),
)(PageSwitch)
