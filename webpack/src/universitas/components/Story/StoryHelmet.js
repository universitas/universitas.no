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

  const meta = {
    'og:url': pageurl,
    'og:type': 'article',
    'og:title': 'article',
    'og:description': 'article',
    'og:locale': 'article',
    'og:updated_time': 'article',
    robots: publication_status != STATUS_PUBLISHED ? 'noindex' : 'all',
    ...(fb_image
      ? {
          'og:image:url': fb_image,
          'og:image:type': 'image/jpeg',
          'og:image:width': '800',
          'og:image:height': '420',
        }
      : {}),
  }
  return (
    <Helmet>
      <title>{pagetitle}</title>
      <link rel="canonical" href={pageurl} />
      <link rel="shortlink" href={shorturl} />
      {renderMeta(meta)}
    </Helmet>
  )
}

const renderMeta = R.pipe(
  R.mapObjIndexed((value, property, _) => (
    <meta key={property} property={property} content={value} />
  )),
  R.values,
)
export default StoryHelmet
