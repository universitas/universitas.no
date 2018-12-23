import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import '../universitas/styles/universitas.scss'
import IconTable from './icons'
import ColourTable from './colours'
import Typography from './typography'

storiesOf('Elements', module)
  .add('colors', () => <ColourTable />)
  .add('basic typography', () => <Typography />)
  .add('icons', () => <IconTable />)

require('./frontPageEdit')
require('./forms')
require('./zoomslider')
require('./select')
import Editor from 'markup/components/Editor'
storiesOf('Editor', module).add('new editor', () => (
  <Editor value={'hello [world]!'} />
))
