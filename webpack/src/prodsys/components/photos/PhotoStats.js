import { formatDate, formatFileSize } from 'utils/text'
import { slugifyFilename } from 'utils/fileUtils'
import React from 'react'
import cx from 'classnames'

const formatTime = dt => formatDate(dt, 'YYYY-MM-DD')
const formatCategory = n =>
  ['–', 'foto', 'illustrasjon', 'diagram', 'bylinefoto', 'ekstern'][n] || '?'
const mapObject = (fn, obj) =>
  R.pipe(
    R.mapObjIndexed(fn),
    R.values,
  )(obj)

const formatFuncs = {
  created: formatTime,
  category: s => s.substring(0, 4),
  mimetype: R.pipe(
    R.defaultTo('?/?'),
    R.split('/'),
    R.last,
  ),
  filesize: formatFileSize,
}

const reformat = ({ key, value = '–' }) => ({
  name: key,
  title: `${key}: ${value}`,
  value: formatFuncs[key] ? formatFuncs[key](value) : value,
})

const pipeline = component =>
  R.pipe(
    ({
      id,
      filename = '–',
      created,
      artist,
      width = 0,
      height = 0,
      category,
      usage,
      filesize = 0,
      mimetype = '',
    }) => ({
      id,
      filename,
      created,
      artist,
      size: `${width} × ${height}`,
      category: formatCategory(category),
      usage,
      mimetype,
      filesize,
    }),
    component,
  )

const Stat = ({ value, name, title }) => (
  <div title={title} style={{ gridArea: name }} className={cx('stat')}>
    {`${value}`}
  </div>
)

const PhotoStats = (props = { filename, artist }) => (
  <div className="PhotoStats">
    {mapObject(
      (value, key, obj) => (
        <Stat key={key} {...reformat({ key, value })} />
      ),
      props,
    )}
  </div>
)

export default pipeline(PhotoStats)
