import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import '../../src/stylesheets/universitas.scss'
import IconTable from './icons'
import ColourTable from './colours'
import Typography from './typography'
import { EditorDemo } from './editordemo'

storiesOf('Elements', module)
  .add('icons', () => <IconTable />)
  .add('colors', () => <ColourTable />)
  .add('basic typography', () => <Typography />)
storiesOf('Demos', module).add('editor demo', () => <EditorDemo />)
