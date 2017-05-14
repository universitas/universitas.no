import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { nextAction, prevAction, refreshAction } from './actions'

let ResultsPanel = ({
  url = ' ',
  count = '-',
  next,
  nextButtonOnClick,
  previous,
  previousButtonOnClick,
  refreshButtonOnClick,
}) => {
  return (
    <section className="ResultsPanel">
      <div className="urlPanel">
        {url}
      </div>
      <div className="countPanel">
        {count}
      </div>
      {previous && <button onClick={previousButtonOnClick}>previous</button>}
      {url && <button onClick={refreshButtonOnClick}>refresh</button>}
      {next && <button onClick={nextButtonOnClick}>next</button>}
    </section>
  )
}
ResultsPanel = connect(
  store => store.searchField,
  dispatch => ({
    refreshButtonOnClick: e => dispatch(refreshAction()),
    nextButtonOnClick: e => dispatch(nextAction()),
    previousButtonOnClick: e => dispatch(prevAction()),
  })
)(ResultsPanel)

export { ResultsPanel }
