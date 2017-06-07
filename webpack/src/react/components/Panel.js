import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Panel = ({ children }) =>
  <section className="Panel"  >
    { ...children }
  </section>

Panel.propTypes = {
  children: PropTypes.any.isRequired
}
const mapStateToProps = (state, ownProps) => ({

})
const mapDispatchToProps = (dispatch, ownProps) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Panel)
