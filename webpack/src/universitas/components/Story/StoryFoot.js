import { reverse, toStory } from 'universitas/ducks/router'
import RelatedStories from 'universitas/components/RelatedStory'
import StrossleWidget from 'universitas/components/StrossleWidget'
import FacebookComments from 'universitas/components/FacebookComments'

const STROSSLE_ID = 'dff15dfe-e8ca-4e6d-b547-8038ab88562b'
const ACCELERATOR_ID = 'cf6209fc-8eae-4041-bbf9-6d9129336326'

const StoryFoot = ({
  comment_field,
  strossle_enabled = true,
  id,
  title,
  section,
  related_stories,
}) => {
  const url = `https://universitas.no${reverse(
    toStory({ id, section, title }),
  )}`

  return (
    <footer className="StoryFoot">
      {comment_field == 'facebook' && <FacebookComments url={url} />}
      {strossle_enabled ? (
        <>
          <StrossleWidget v2 url={url} id={STROSSLE_ID} />
          <StrossleWidget v1 url={url} id={ACCELERATOR_ID} />
        </>
      ) : (
        <RelatedStories related_stories={related_stories} />
      )}
    </footer>
  )
}

export default StoryFoot
