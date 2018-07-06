import { connect } from 'react-redux'
import { getFeed, getSearchResults, feedRequested } from 'ducks/newsFeed'
import { NewsFeed } from './NewsFeed'

const mapStateToProps = s => ({ items: getSearchResults(s), ...getFeed(s) })
const mapDispatchToProps = (dispatch, ownProps) => ({ feedRequested })
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)
