import React from 'react'
import { storiesOf } from '@storybook/react'

import PhotoUpload from './App'
import ImagePreview from './ImagePreview'
import ImageWrapper from './ImageWrapper'
import mooch from './assets/mooch.jpg'

storiesOf('Upload', module)
  .add('photo upload', () => <PhotoUpload />)
  .add('file preview', () => (
    <ImagePreview
      {...{
        date: new Date(),
        thumb: mooch,
        width: 1000,
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
