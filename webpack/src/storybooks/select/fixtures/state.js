import data from './state.json'
import thumbs from './thumbs.js'

const extractId = R.pipe(R.defaultTo(''), R.match(/\d+/g), R.last)

export default R.pipe(
  R.over(
    R.lensPath(['contributors', 'items']),
    R.map(item => ({ ...item, thumb: thumbs[extractId(item.byline_photo)] })),
  ),
  R.over(
    R.lensPath(['photos', 'items']),
    R.map(item => ({ ...item, small: thumbs[item.id] })),
  ),
  R.over(
    R.lensPath(['stories', 'items']),
    R.map(
      R.pick([
        'id',
        'title',
        'working_title',
        'story_type_name',
        'modified',
        'publication_status',
      ]),
    ),
  ),
)(data)
