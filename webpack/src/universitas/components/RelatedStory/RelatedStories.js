import RelateStory from './RelatedStory.js'
import { shuffle } from 'utils/misc'

const pickRelated = R.pipe(
  shuffle,
  R.take(3),
)

const RelatedStories = ({ related_stories }) => (
  <section className="RelatedStories">
    <h2 className="sectionTitle">Les også:</h2>
    {pickRelated(related_stories).map((id, idx) => (
      <RelatedStory key={idx} id={id} />
    ))}
  </section>
)

export default RelatedStories
