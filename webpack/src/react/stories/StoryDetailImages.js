import React from 'react'
import cx from 'classnames'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import { connect } from 'react-redux'
import StoryImage from 'storyimages/StoryImage'

const StoryDetailImages = ({ images = [], createHandler, deleteHandler }) => (
  <div className="panelContent">
    {images.map(pk => (
      <StoryImage key={pk} pk={pk} deleteHandler={deleteHandler} />
    ))}
  </div>
)

const { getItem: getStory } = modelSelectors('stories')

const mapStateToProps = (state, { pk }) => ({
  items: getStory(pk)(state).items,
})

export default connect(mapStateToProps)(StoryDetailImages)
