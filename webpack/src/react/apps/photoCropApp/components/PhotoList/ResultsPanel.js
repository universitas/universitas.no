import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  getImageList,
  nextAction,
  prevAction,
  refreshAction,
} from '../../ducks/imageList'

const Button = ({ onClick, children }) => (
  <button onClick={onClick} disabled={!onClick}> {children}</button>
)

let ResultsPanel = ({
  url = '',
  count = '-',
  next,
  nextAction,
  previous,
  prevAction,
  refreshAction,
}) => {
  return (
    <section className="ResultsPanel">
      <div className="urlPanel">
        <a href={url}>{url}</a>
      </div>
      <div className="countPanel">
        {count}
      </div>
      <Button onClick={previous && prevAction}>previous</Button>
      <Button onClick={url && refreshAction}>refresh</Button>
      <Button onClick={next && nextAction}>next</Button>
    </section>
  )
}
ResultsPanel = connect(getImageList, { refreshAction, nextAction, prevAction })(
  ResultsPanel
)

export { ResultsPanel }
