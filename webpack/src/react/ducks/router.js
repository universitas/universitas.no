// ducks for redux-first-router of frontpage apps

import { NOT_FOUND } from 'redux-first-router'

export const HOME = 'router/HOME'
export const SECTION = 'router/SECTION'
export const PDF = 'router/PDF'
export const STORY = 'router/STORY'

// Action creators
export const toHome = () => ({ type: HOME, payload: { section: null } })
export const toSection = section => ({ type: SECTION, payload: { section } })
export const toPdf = () => ({ type: PDF, payload: {} })
export const toStory = (id, slug) => ({ type: STORY, payload: { id, slug } })

// url routes action mappings

export const routesMap = {
  [HOME]: '/',
  [PDF]: '/pdf/',
  [SECTION]: '/seksjon/:section/',
  [STORY]: '/sak/:id/:slug/',
  [NOT_FOUND]: '/not-found/',
}

export const getPage = R.pathOr(NOT_FOUND, ['location', 'type'])
