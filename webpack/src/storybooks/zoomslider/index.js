import React from 'react'
import { storiesOf } from '@storybook/react'
import ZoomSlider from 'components/ZoomSlider'
import { number, text, radios, select } from '@storybook/addon-knobs'

storiesOf('zoomslider', module).addWithJSX('slider', () => {
  const style = {
    fontSize:
      number('size', 3, {
        range: true,
        min: 0.5,
        max: 25,
        step: 0.1,
      }) + 'rem',
    backgroundColor: radios(
      'background',
      ['#fff', '#ddd', '#888', '#222'],
      '#222',
    ),
    color: radios('color', ['#fff', '#ddd', '#888', '#222'], '#ddd'),
  }
  return <ZoomSlider style={style} />
})
