import { hyphenate, formatDate } from 'utils/text'
import anonymous from 'images/anonymous.png'

const datelineFormat = R.pipe(
  formatDate,
  R.replace(/^(...)\S+/, '$1'),
)

const DateLine = ({ publication_date }) => (
  <div className="DateLine">
    {datelineFormat(publication_date || new Date())}
  </div>
)

const creditDisplay = credit =>
  ({
    by: 'Av',
    text: 'Tekst',
    video: 'Video',
    photo: 'Foto',
    illustration: 'Illustra\xADsjon',
    graphics: 'Grafikk',
    translation: 'Over\xADsettelse',
    'text and photo': 'Tekst og foto',
    'text and video': 'Tekst og video',
    'photo and video': 'Foto og video',
  }[credit] || credit)

const StoryInfo = ({
  theme_word,
  story_type,
  story_type_name = story_type.name,
}) => (
  <div className="StoryInfo">
    <div className="storytype">{story_type_name}</div>
    <div className="themeword">{hyphenate(theme_word)}</div>
  </div>
)

const Byline = ({ credit, name, title, contributor, thumb }) => (
  <div className="Byline">
    {thumb && <img className="face" src={thumb} alt={name} />}
    {!title && credit && <div className="credit">{creditDisplay(credit)}:</div>}
    <div className="name">{name}</div>
    {title && <div className="title">{title}</div>}
  </div>
)

const Bylines = ({ bylines }) =>
  R.pipe(
    R.sortBy(R.prop('ordering')),
    // R.uniqBy(R.pick(['contributor', 'credit'])),
    R.map(R.when(R.propEq('thumb', '?'), R.assoc('thumb', anonymous))),
    R.addIndex(R.map)((props, idx) => <Byline key={idx} {...props} />),
  )(bylines)

const StorySidebar = ({ bylines = [], ...props }) => (
  <section className="StorySidebar">
    <StoryInfo {...props} />
    <DateLine {...props} />
    <Bylines bylines={bylines} />
  </section>
)

export default StorySidebar
