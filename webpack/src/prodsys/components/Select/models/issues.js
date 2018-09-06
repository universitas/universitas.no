import optionWrapper from './optionWrapper.js'
import { formatDate } from 'utils/text'

const today = () => new Date().toISOString().slice(0, 10)

const divideTime = R.pipe(R.propSatisfies(R.gte(today()), 'publication_date'))

export const reshapeOptions = R.pipe(
  R.sortWith([R.descend(R.prop('publication_date'))]),
  R.partition(R.propSatisfies(R.gt(today()), 'publication_date')),
  ([past, future]) => [
    { label: 'kommende utgaver', options: R.reverse(future) },
    { label: 'tidligere utgaver', options: past },
  ],
)

export const reshape = props => ({
  value: props.id,
  label: props.issue_name,
  ...props,
})

const Option = ({ label, publication_date }) => (
  <div className="IssueOption">
    {label} <small>{formatDate(publication_date, 'D. MMMM')}</small>
  </div>
)

export const components = {
  Option: optionWrapper(Option),
}
