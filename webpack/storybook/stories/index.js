import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import '../../src/stylesheets/universitas.scss'
import IconTable from './icons'
import ColourTable from './colours'
import Typography from './typography'
import StoryEditor from './storyEditor'
import PhotoUpload from './photoUpload'
import ImagePreview from './photoUpload/ImagePreview'
import ImageWrapper from './photoUpload/ImageWrapper'
import irgens from './assets/mooch.jpg'

storiesOf('Elements', module)
  .add('icons', () => <IconTable />)
  .add('colors', () => <ColourTable />)
  .add('basic typography', () => <Typography />)

storiesOf('Editor', module).add('story editor', () => <StoryEditor />)

storiesOf('File upload', module)
  .add('photo upload', () => <PhotoUpload />)
  .add('file preview', () => (
    <ImagePreview
      {...{
        date: new Date(),
        thumb: irgens,
        width: 1500,
        height: 903,
        size: 80852,
        filename: 'the-mooch.jpg',
        timestamp: performance.now(),
        description: "It's the MOOCH!",
        artist: 'Antony Scaramouchi',
      }}
    />
  ))
  .add('api demo', () => <ImageWrapper />)
