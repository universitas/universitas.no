import { connect } from 'react-redux'
import { getStory } from 'ducks/publicstory'
import { toStory } from 'ducks/router'
import RouterLink from 'redux-first-router-link'
import Debug from 'components/Debug'

const getImage = R.pipe(
  R.filter(R.propEq('placement', 'head')),
  R.head,
  R.defaultTo({}),
  R.prop('cropped'),
)

const MainImage = ({ src }) => <img className="image" src={src} />

export const RelatedStory = ({ title, lede, section, id, images }) =>
  title ? (
    <article className="RelatedStory">
      <RouterLink to={toStory({ title, section, id })}>
        <MainImage src={getImage(images)} />
        <h1 className="title">{title}</h1>
      </RouterLink>
    </article>
  ) : null

const mapStateToProps = (state, { id }) => R.defaultTo({}, getStory(id)(state))
export default connect(mapStateToProps)(RelatedStory)
