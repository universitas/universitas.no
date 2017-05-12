import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { searchAction } from './actions'

let SearchField = ({ text, searchChanged }) => {
  const clearButtonOnClick = e => {
    searchChanged('')
    searchInput.focus()
  }
  const searchInputOnChange = e => {
    searchChanged(e.target.value)
  }
  let searchInput = null // ref placeholder
  return (
    <section className="SearchField">
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
    </section>
  )
}
SearchField = connect(
  store => store.searchField,
  dispatch => ({
    searchChanged: text => dispatch(searchAction(text)),
  })
)(SearchField)

export { SearchField }
