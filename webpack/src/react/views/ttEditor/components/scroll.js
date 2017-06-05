const STEPS = 10
const TICK = 10

const scrollElement = (element, duration = STEPS) => {
  if (!element) return
  const container = element.parentElement
  const target =
    element.offsetTop - (container.offsetHeight - element.offsetHeight) / 2
  console.log(target)
  scrollTo(container, target, duration)
}

const scrollTo = (element, target, duration) => {
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

export { scrollTo, scrollElement }
