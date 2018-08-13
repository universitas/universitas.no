import { Helmet } from 'react-helmet'
import { reverseFull, toStory, toShortUrl } from 'ducks/router'
const STATUS_PUBLISHED = 10

const authors = R.tryCatch(
  R.pipe(R.pluck('name'), R.join(', ')),
  R.always(console.error),
)

const StoryHelmet = ({
  id,
  title,
  story_type,
  lede,
  bylines = [],
  language,
  modified,
  fb_image,
  publication_status,
}) => {
  const pagetitle = `${title} | ${story_type.name} | universitas.no`
  const pageurl = reverseFull(toStory({ id, title, story_type }))
  const shorturl = reverseFull(toShortUrl({ id }))
  return (
    <Helmet>
      <title>{pagetitle}</title>
      <link rel="canonical" href={pageurl} />
      <link rel="shortlink" href={shorturl} />
      <meta name="description" content={lede} />
      <meta name="author" content={authors(bylines)} />
      <meta property="og:url" content={pageurl} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={lede} />
      <meta property="og:locale" content={language} />
      <meta property="og:updated_time" content={modified} />
      {fb_image && <meta property="og:image" content={fb_image} />}
      {publication_status != STATUS_PUBLISHED && (
        <meta name="robots" content="noindex" />
      )}
    </Helmet>
  )
}

export default StoryHelmet
