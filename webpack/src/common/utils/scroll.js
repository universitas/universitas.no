const STEPS = 10
const TICK = 10

export const scrollElement = (element, duration = STEPS) => {
  if (!element) return
  const container = element.parentElement
  const target =
    element.offsetTop - (container.offsetHeight - element.offsetHeight) / 3
  scrollTo(container, target, duration)
}

export const scrollTo = (element, target, duration) => {
  const pos = element.scrollTop
  if (duration <= 0 || pos === target) return
  if (duration === 1) {
    element.scrollTop = target
    return
  }
  setTimeout(() => {
    element.scrollTop = pos + (target - pos) / duration
    scrollTo(element, target, duration - 1)
  }, TICK)
}

// get scrollposition as number in range [0, 1]
export const getScroll = el =>
  el.scrollTop / (el.scrollHeight - el.clientHeight)

// set scrollposition as number in range [0, 1]
export const setScroll = (el, pos) =>
  (el.scrollTop = pos * (el.scrollHeight - el.clientHeight))
