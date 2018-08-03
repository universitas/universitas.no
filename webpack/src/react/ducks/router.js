// ducks for redux-first-router of frontpage apps

import { NOT_FOUND, actionToPath } from 'redux-first-router'
import { slugify } from 'utils/text'
import { absoluteURL } from 'utils/urls'
import restoreScroll from 'redux-first-router-restore-scroll'

const BASENAME = '/'
const SLICE = 'location'

export const routerOptions = {
  basename: BASENAME,
  restoreScroll: restoreScroll(),
}

export const HOME = 'router/HOME'
export const SECTION = 'router/SECTION'
export const PDF = 'router/PDF'
export const ABOUT = 'router/ABOUT'
export const AD_INFO = 'router/AD_INFO'
export const STORY = 'router/STORY'
export const SCHEDULE = 'router/SCHEDULE'
export const SHORT_URL = 'router/SHORT_URL'
export { NOT_FOUND }

// Action creators
export const toHome = () => ({ type: HOME, payload: { section: null } })
export const toSection = section => ({ type: SECTION, payload: { section } })
export const toPdf = year => ({ type: PDF, payload: { year } })
export const toPubSchedule = year => ({ type: SCHEDULE, payload: { year } })
export const toAbout = () => ({ type: ABOUT, payload: {} })
export const toAdInfo = () => ({ type: AD_INFO, payload: {} })
export const toStory = ({ id, title = '', section, story_type = {} }) => ({
  type: STORY,
  payload: {
    id,
    slug: slugify(title).substr(0, 50),
    section: slugify(section || story_type.section || 'sak') || null,
  },
})
export const toShortUrl = ({ id }) => ({ type: SHORT_URL, payload: { id } })

// url routes action mappings

export const routesMap = {
  [HOME]: '/',
  [PDF]: '/pdf/:year?/',
  [SCHEDULE]: '/utgivelsesplan/:year?/',
  [STORY]: '/:section/:id(\\d+)/:slug?',
  [SHORT_URL]: '/:section?/:id(\\d+)/:slug?/',
  [ABOUT]: '/om-universitas/',
  [AD_INFO]: '/annonser/',
  [SECTION]: '/:section/forside/',
  [NOT_FOUND]: '/not-found/',
}

export const reverse = action => actionToPath(action, routesMap)
export const reverseFull = R.pipe(
  reverse,
  R.concat(routerOptions.basename || ''),
  absoluteURL,
)

export const getLocation = R.prop(SLICE)
