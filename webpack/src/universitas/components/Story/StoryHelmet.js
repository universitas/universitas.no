import { Helmet } from 'react-helmet'
import { reverseFull, toStory, toShortUrl } from 'ducks/router'
const STATUS_PUBLISHED = 10

const authors = R.tryCatch(
  R.pipe(R.pluck('name'), R.join(', ')),
  R.always(console.error),
)

const locale = language =>
  ({
    nb: 'nb_no',
    nn: 'nn_no',
    en: 'en_gb',
  }[language] || '')

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

  const openGraphMeta = {
    'og:url': pageurl,
    'og:type': 'article',
    'og:title': title,
    'og:description': lede,
    'og:locale:locale': locale(language),
    'og:updated_time': modified,
    ...(fb_image
      ? {
          'og:image:url': fb_image,
          'og:image:type': 'image/jpeg',
          'og:image:width': '800',
          'og:image:height': '420',
          'og:image:alt': title,
        }
      : {}),
  }
  return (
    <Helmet>
      <title>{pagetitle}</title>
      <link rel="canonical" href={pageurl} />
      <link rel="shortlink" href={shorturl} />
      {renderOpenGraphMetaTags(openGraphMeta)}
      <meta
        name="robots"
        content={publication_status != STATUS_PUBLISHED ? 'noindex' : 'all'}
      />
    </Helmet>
  )
}

const renderOpenGraphMetaTags = R.pipe(
  R.mapObjIndexed((value, property, _) => (
    <meta key={property} property={property} content={value} />
  )),
  R.values,
)
export default StoryHelmet
