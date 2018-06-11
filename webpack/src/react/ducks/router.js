// ducks for redux-first-router of frontpage apps

import { NOT_FOUND, actionToPath } from 'redux-first-router'
import { slugify } from 'utils/text'
import { absoluteURL } from 'utils/urls'

const SLICE = 'location'

export const HOME = 'router/HOME'
export const SECTION = 'router/SECTION'
export const PDF = 'router/PDF'
export const STORY = 'router/STORY'
export const SHORT_URL = 'router/SHORT_URL'

// Action creators
export const toHome = () => ({ type: HOME, payload: { section: null } })
export const toSection = section => ({ type: SECTION, payload: { section } })
export const toPdf = () => ({ type: PDF, payload: {} })
export const toStory = ({ id, title = '' }) => ({
  type: STORY,
  payload: { id, slug: slugify(title) || null },
})
export const toShortUrl = ({ id }) => ({ type: SHORT_URL, payload: { id } })

// url routes action mappings

export const routesMap = {
  [HOME]: '/',
  [PDF]: '/pdf/',
  [SECTION]: '/seksjon/:section/',
  [STORY]: '/sak/:id(\\d+)/:slug?/',
  [SHORT_URL]: '/:section?/:id(\\d+)/:slug?/',
  [NOT_FOUND]: '/not-found/',
}

export const routerOptions = {
  scrollTop: true,
  basename: '/dev',
}

export const reverse = action => actionToPath(action, routesMap)
export const reverseFull = R.pipe(
  reverse,
  R.concat(routerOptions.basename || ''),
  absoluteURL
)

export const getLocation = R.prop(SLICE)
