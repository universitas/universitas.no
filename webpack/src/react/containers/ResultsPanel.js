import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getImageList, searchUrlChanged } from 'ducks/imageList'

let Button = ({ onClick, children }) => (
  <button onClick={onClick} disabled={!onClick}> {children}</button>
)
Button = connect(null, (dispatch, { url }) => ({
  onClick: url ? () => dispatch(searchUrlChanged(url)) : null,
}))(Button)

let ResultsPanel = ({
  count = '-',
  url = '',
  next,
  previous,
  searchUrlChanged,
}) => {
  return (
    <section className="ResultsPanel">
      <div className="urlPanel">
        <a href={url}>{url}</a>
      </div>
      <div className="countPanel">
        {count}
      </div>
      <Button url={previous}>previous</Button>
      <Button url={url}>refresh</Button>
      <Button url={next}>next</Button>
    </section>
  )
}
ResultsPanel = connect(getImageList)(ResultsPanel)

export default ResultsPanel
