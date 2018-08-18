import React from 'react'
import ModelField from 'components/ModelField'
import { fields } from './model.js'

const mapFields = fn =>
  R.pipe(
    R.mapObjIndexed((props, name, obj) => fn({ name, ...props })),
    R.values,
  )

const StoryImageForm = ({ pk }) => (
  <form className="StoryImageForm">
    {mapFields(fp => (
      <ModelField {...fp} model="storyimages" pk={pk} key={fp.name} />
    ))(fields)}
  </form>
)

export default StoryImageForm
