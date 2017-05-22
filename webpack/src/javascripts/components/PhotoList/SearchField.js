import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { searchAction, toggleThumbStyle } from './actions'

let SearchField = ({ text, searchChanged, toggleThumbStyle, fetching }) => {
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
        value={text}
        onChange={searchInputOnChange}
        ref={input => (searchInput = input)}
        type="search"
        placeholder="search"
        spellCheck={false}
        tabIndex={1}
      />
      <button disabled={!text} onClick={clearButtonOnClick}>
        Clear
      </button>
      <button onClick={toggleThumbStyle}>
        Style
      </button>
    </section>
  )
}
SearchField = connect(
  store => store.searchField,
  dispatch => ({
    searchChanged: text => dispatch(searchAction(text)),
    toggleThumbStyle: e => dispatch(toggleThumbStyle()),
  })
)(SearchField)

export { SearchField }
