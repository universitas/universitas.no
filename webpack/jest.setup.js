// sets up jest to run tests
// import the same modules as ProvidePlugin in webpack.config.js
// This makes React and R globally available in tests

import React from 'react'
import R from 'ramda'
global.R = R
global.React = React
