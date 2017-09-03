import { connect } from 'react-redux'

import { connect } from 'react-redux'

const PhotoList = ({ items = [], search = '', displayOptions = {} }) => (
  <section className="PhotoList" />
)
PhotoList.propTypes = {
  items: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  displayOptions: PropTypes.object.isRequired,
}
const mapStateToProps = (state, ownProps) => ({})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(PhotoList)
