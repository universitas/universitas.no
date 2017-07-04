import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  getImageList,
  nextAction,
  prevAction,
  refreshAction,
} from '../../ducks/imageList'

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
        <a href={url}>{url}</a>
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
  store => getImageList(store),
  dispatch => ({
    refreshButtonOnClick: e => dispatch(refreshAction()),
    nextButtonOnClick: e => dispatch(nextAction()),
    previousButtonOnClick: e => dispatch(prevAction()),
  })
)(ResultsPanel)

export { ResultsPanel }
