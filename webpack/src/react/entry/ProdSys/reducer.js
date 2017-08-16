import { combineReducers } from 'redux'

import { reducer as issues } from 'issues/duck'
import { reducer as contributors } from 'contributors/duck'
import { reducer as photos } from 'photos/duck'
import { reducer as stories } from 'stories/duck'

export default { issues, contributors, photos, stories }
