import { configure, setAddon, addDecorator } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs'
import { configureActions } from '@storybook/addon-actions'

import jsxAddon from 'storybook-addon-jsx'
const loadStories = () => require('../src/storybooks/index.js')

configureActions({
  depth: 5,
  limit: 5,
})

setOptions({
  name: 'universitas.no storybooks',
  url: 'https://github.com/universitas/universitas.no',
  showStoriesPanel: true,
  showAddonPanel: true,
  addonPanelInRight: true,
  showSearchBox: false,
})

addDecorator(withKnobs) // knobs!
setAddon(jsxAddon) // show jsx

// import { checkA11y } from '@storybook/addon-a11y'
// addDecorator(checkA11y) // accessability checker

configure(loadStories, module)
