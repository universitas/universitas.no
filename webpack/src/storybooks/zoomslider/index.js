import React from 'react'
import { storiesOf } from '@storybook/react'
import { ZoomControl } from 'components/PreviewIframe'
import { number, text, radios, select } from '@storybook/addon-knobs'

storiesOf('ZoomControl', module).addWithJSX('slider', () => {
  return <ZoomControl />
})
