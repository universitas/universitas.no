import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { fetchAction } from './actions'

let GetButton = ({ fetchImages }) => (
  <button className="GetButton" onClick={fetchImages}>fetch</button>
)
const mapDispatchToProps = (dispatch, { search_field }) => ({
  fetchImages: e => dispatch(fetchAction()),
})
GetButton = connect(null, mapDispatchToProps)(GetButton)
export { GetButton }
