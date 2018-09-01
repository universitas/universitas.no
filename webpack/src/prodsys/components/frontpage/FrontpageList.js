import cx from 'classnames'
import { connect } from 'react-redux'
import ListPanel from 'components/ListPanel'
import { Clear } from 'components/Icons'
import { FrontpageGrid } from '.'
import { MODEL, fields } from './model.js'

const month = parseInt(new Date().toISOString().slice(5, 7))
let year = parseInt(new Date().toISOString().slice(0, 4))
if (month > 10) year += 1

const filters = [
  {
    toggle: true,
    model: MODEL,
    attr: 'language',
    value: 'nor',
    label: 'norsk',
  },
  {
    toggle: true,
    model: MODEL,
    attr: 'language',
    value: 'eng',
    label: 'engelsk',
  },
]

const FrontpageList = ({ model = MODEL }) => {
  return (
    <ListPanel model={model} filters={filters}>
      <FrontpageGrid />
    </ListPanel>
  )
}
export default FrontpageList
