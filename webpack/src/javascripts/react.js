/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'

const HelloWorld = () => <h1>Foobar</h1>

export default () => { ReactDOM.render(<HelloWorld />, document.getElementById('react-container')) }
