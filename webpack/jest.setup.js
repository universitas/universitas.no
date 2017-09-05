// sets up jest to run tests
//
// import the same modules as in  ProvidePlugin in webpack.config.js

import R from 'ramda'
window.R = R // make R available in global scope for test runner.
