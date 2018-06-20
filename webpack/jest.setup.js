// sets up jest to run tests
//
// import the same modules as in  ProvidePlugin in webpack.config.js

import React from 'react'
import R from 'ramda'
global.R = R
global.React = React
