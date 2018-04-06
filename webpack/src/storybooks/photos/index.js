import React from 'react'
import { storiesOf } from '@storybook/react'
import { Person, TextFields, Transform, Time, Info } from 'components/Icons'

import apidata from './apifixture.json'

const PhotoItem = ({
  editable,
  large,
  artist,
  created,
  contributor,
  description,
  name,
  size,
  stat,
}) => (
  <div className="PhotoItem">
    <img src={large} />
    <TextFields />
    <Person />
    <Info />
    <Time />
    <Transform />
  </div>
)

storiesOf('Photos', module).add('photo detail', () => (
  <PhotoItem {...apidata[0]} />
))
