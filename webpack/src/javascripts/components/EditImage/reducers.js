const cropWidget = (state = { id: 0, expanded: false }, action) => {
  switch (action.type) {
    case 'SELECT_IMAGE':
      return { ...state, id: action.payload.id }
    case 'DISMISS_WIDGET':
      return { ...state, id: 0 }
    case 'EXPAND_WIDGET':
      return { ...state, expanded: true }
    case 'SHRINK_WIDGET':
      return { ...state, expanded: false }
    default:
      return state
  }
}

export { cropWidget }
