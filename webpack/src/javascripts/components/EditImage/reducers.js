const PANEL_STATES = 3 // number of possible states

const cropWidget = (state = { id: 0, expanded: false, panels: 0 }, action) => {
  switch (action.type) {
    case 'SELECT_IMAGE':
      return { ...state, id: action.payload.id }
    case 'DISMISS_WIDGET':
      return { ...state, id: 0 }
    case 'RESIZE_WIDGET':
      return { ...state, expanded: !state.expanded }
    case 'CYCLE_PANELS':
      return { ...state, panels: (state.panels + 1) % PANEL_STATES }
    default:
      return state
  }
}

export { cropWidget }
