import { Feed } from './NewsFeed.js'
import { getFeed, getSearchResults, feedRequested } from 'ducks/newsFeed'

import { connect } from 'react-redux'
const mapStateToProps = s => ({ items: getSearchResults(s), ...getFeed(s) })
const mapDispatchToProps = (dispatch, ownProps) => ({ feedRequested })
export default connect(mapStateToProps, mapDispatchToProps)(Feed)
