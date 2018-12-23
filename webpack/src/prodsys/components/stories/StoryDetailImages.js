import cx from 'classnames'
import { connect } from 'react-redux'
import { StoryImage } from 'components/storyimages'
import { PlaceHolder } from 'components/storyimages/StoryImage'
import { selectors } from './model.js'
import Info from 'components/Info'

const StoryDetailImages = ({ image_count = 0, images }) => {
  if (!image_count)
    return (
      <Info>Ingen bilder valgt i saken. Klikk på bilder for å legge til.</Info>
    )
  if (!images)
    return R.pipe(
      R.range(0),
      R.map(key => <PlaceHolder key={key} />),
      R.values,
    )(image_count)
  return R.pipe(
    R.sort(R.ascend(R.prop('ordering'))),
    R.map(({ id }) => <StoryImage key={id} pk={id} />),
    R.values,
  )(images)
}

const mapStateToProps = (state, { pk }) =>
  R.pipe(
    selectors.getItem(pk),
    R.pick(['image_count', 'images']),
  )(state)

export default connect(mapStateToProps)(StoryDetailImages)
