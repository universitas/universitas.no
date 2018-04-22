import { connect } from 'react-redux'
import { getImageList, searchChanged, thumbStyleCycle } from 'x/ducks/imageList'

let SearchField = ({
  searchText,
  fetching,
  searchChanged,
  thumbStyleCycle,
}) => {
  const clearButtonOnClick = e => {
    searchChanged('')
    searchInput.focus()
  }
  const searchInputOnChange = e => {
    searchChanged(e.target.value)
  }
  let searchInput = null // ref placeholder
  const isFetching = fetching ? ' isFetching' : ''
  return (
    <section className={`SearchField${isFetching}`}>
      <input
        value={searchText}
        onChange={searchInputOnChange}
        ref={input => (searchInput = input)}
        type="search"
        placeholder="search"
        spellCheck={false}
        tabIndex={1}
      />
      <button disabled={!searchText} onClick={clearButtonOnClick}>
        Clear
      </button>
      <button onClick={thumbStyleCycle}>Style</button>
    </section>
  )
}
SearchField = connect(
  store => getImageList(store),
  dispatch => ({
    searchChanged: searchText => dispatch(searchChanged(searchText)),
    thumbStyleCycle: e => dispatch(thumbStyleCycle()),
  })
)(SearchField)

export default SearchField
