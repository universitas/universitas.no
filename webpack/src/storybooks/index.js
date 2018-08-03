import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import '../react/styles/universitas.scss'
import IconTable from './icons'
import ColourTable from './colours'
import Typography from './typography'
import StoryEditor from './storyEditor'
import Editor from 'markup/components/Editor'

storiesOf('Elements', module)
  .add('icons', () => <IconTable />)
  .add('colors', () => <ColourTable />)
  .add('basic typography', () => <Typography />)

storiesOf('Editor', module)
  .add('new editor', () => <Editor value={'hello [world]!'} />)
  .add('story editor', () => <StoryEditor />)

require('./forms')
