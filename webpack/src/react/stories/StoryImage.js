import React from 'react'
import cx from 'classnames'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import { deleteStoryImage } from 'ducks/storyimage'
import ModelField from 'components/ModelField'
import { connect } from 'react-redux'
import Thumb from 'components/Thumb'

const fields = {
  small: {
    type: 'thumb',
    required: false,
  },
  caption: {
    type: 'shorttext',
    required: false,
    label: 'Bildetekst',
    help_text: 'Kort beskrivelse av bildet',
    rows: 4,
    editable: true,
  },
  creditline: {
    type: 'string',
    required: false,
    label: 'Bildetekst byline',
    editable: true,
  },
}

const mapFields = fields => fn =>
  R.pipe(
    R.mapObjIndexed((props, name, obj) => fn({ name, ...props })),
    R.values
  )(fields)

const StoryImage = ({ pk, id, deleteHandler, fetch }) => {
  if (!id) {
    fetch()
    return '...'
  } else {
    return (
      <div className="StoryImage">
        <button onClick={deleteHandler}>slett</button>
        {mapFields(fields)(fp => (
          <ModelField {...fp} model="storyimages" pk={pk} key={fp.name} />
        ))}
      </div>
    )
  }
}
const { getItem: getStoryImage } = modelSelectors('storyimages')
const { itemRequested } = modelActions('storyimages')
const mapStateToProps = (state, { pk }) => getStoryImage(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  deleteHandler: () => dispatch(deleteStoryImage(pk)),
  fetch: () => dispatch(itemRequested(pk)),
})
export default connect(mapStateToProps, mapDispatchToProps)(StoryImage)
