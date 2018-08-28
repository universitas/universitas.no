// String Field
import * as text from 'utils/text'
import cx from 'classnames'

const formatDate = d => text.formatDate(d, 'DD. MMM YY')

const isPast = d => new Date(d) < new Date()

const Stint = ({ position, start_date, end_date, ...props }) => (
  <div className={cx({ past: isPast(end_date) }, 'Stint')}>
    <span className={cx('position')}>{position}</span>
    <span className={cx('fromdate')}>{formatDate(start_date)}</span>
    {end_date && <span className={cx('todate')}>{formatDate(end_date)}</span>}
  </div>
)

const sortBy = prop => R.sort(R.descend(R.prop(prop)))

export const DetailField = ({ value = [], ...args }) => (
  <span {...args}>
    {R.map(
      props => <Stint key={props.id} {...props} />,
      sortBy('start_date')(value),
    )}
  </span>
)

export const EditableField = ({ value = [], ...args }) => (
  <input type="text" value={text.stringify(value)} {...args} />
)
