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

// Action constants
export const HOME = 'router/HOME'
export const SECTION = 'router/SECTION'
export const PDF = 'router/PDF'
export const ABOUT = 'router/ABOUT'
export const AD_INFO = 'router/AD_INFO'
export const STORY = 'router/STORY'
export const SCHEDULE = 'router/SCHEDULE'
export const SHORT_URL = 'router/SHORT_URL'
export const STYRE_INFO = 'router/STYRE_INFO'
export { NOT_FOUND }

// url routes action mappings to configure redux-first-router
export const routesMap = {
  [HOME]: '/',
  [PDF]: '/pdf/:year(\\d{4})?/',
  [SCHEDULE]: '/utgivelsesplan/:year(\\d{4})?/',
  [STORY]: '/:section/:id(\\d+)/:slug/',
  [SHORT_URL]: '/:section([^/]*)?/:id(\\d+)/:slug([^/]*)?/',
  [ABOUT]: '/om-universitas/',
  [STYRE_INFO]: '/om-styret/',
  [AD_INFO]: '/annonser/',
  [SECTION]: '/:section/forside/',
  [NOT_FOUND]: '/ikke-funnet/',
}

// Action creators
export const toHome = () => ({ type: HOME, payload: { section: null } })
export const toSection = section => ({ type: SECTION, payload: { section } })
export const toPdf = year => ({ type: PDF, payload: { year } })
export const toPubSchedule = year => ({ type: SCHEDULE, payload: { year } })
export const toAbout = () => ({ type: ABOUT, payload: {} })
export const toStyret = () => ({ type: STYRE_INFO, payload: {} })
export const toAdInfo = () => ({ type: AD_INFO, payload: {} })
export const toStory = ({ id, title, section, story_type = {} }) => ({
  type: STORY,
  payload: {
    id,
    slug: slugify(title || 'ingen tittel').substr(0, 50),
    section: slugify(section || story_type.section || 'sak') || null,
  },
})
export const toShortUrl = ({ id }) => ({
  type: SHORT_URL,
  payload: { id, slug: null, section: null },
})

// {action} -> "relative url"
export const reverse = action => actionToPath(action, routesMap)

// {action} -> "absolute url"
export const reverseAbsolute = R.pipe(
  reverse,
  absoluteURL,
)

// selector for location object
export const getLocation = R.prop(SLICE)
