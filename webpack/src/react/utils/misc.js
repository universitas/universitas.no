import * as Redux from 'redux'
import * as R from 'ramda'

export const compose = // use redux devtools if available
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  Redux.compose

// AnimationFrame based debounce function
export const debounce = (func, wait) => {
  let minutes = null
  return (...args) => {
    minutes && window.cancelAnimationFrame(minutes)
    minutes = window.requestAnimationFrame(() => {
      minutes = null
      func(...args)
    })
  }
}
// setTimeout based debounce function. Doesn't perform well in android chrome
export const timeoutDebounce = (func, wait) => {
  let timeout = null
  return (...args) => {
    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, 100)
  }
}

// check if client is a device with touch screen
export const isTouchDevice = () =>
  document && 'ontouchstart' in document.documentElement

// check if client is an Android device
export const isAndroid = () => navigator && /android/i.test(navigator.userAgent)

// check if page is running as standalone Progressive Web App
export const isPWA = () =>
  window && window.matchMedia('(display-mode: standalone)').matches

// check if client is an iPhone device
export const isIphone = () => navigator && /iphone/i.test(navigator.userAgent)

// check if dom element not below the fold
export const isVisible = (element, padding = 0) => {
  if (!element) return false
  return window.scrollY + window.innerHeight > element.offsetTop - padding
}

// scroll to element vertically. center window on element
export const scrollToElement = (centerFromTop = 0.5) => element => {
  if (!(element && window.scrollTo)) return
  const offset = (window.innerHeight - element.offsetHeight) * centerFromTop
  const scrollTop = offset < 0 ? element.offsetTop : element.offsetTop - offset
  window.scrollTo(0, scrollTop)
}

// scroll to top of page
export const scrollToTop = () => window.scrollTo(window.scrollX, 0)

// fetch image file without adding it to the dom
const preFetchImage = ({ image }) => {
  if (!image) return
  const im = new Image()
  im.src = image
}
export const preFetchImages = R.map(preFetchImage)

// event handler wrapper
export const eventHandler = (eventHandler, ...args) => e => {
  e.stopPropagation()
  e.preventDefault()
  eventHandler(...args)
}

// check if timestamp is stale
// :: Number -> String|Number -> Boolean
export const staleAfter = minutes => timestamp =>
  Date.now() - new Date(timestamp).valueOf() > minutes * 1000 * 60
