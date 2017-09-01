import { combineReducers } from 'redux'

import { reducer as issues } from 'issues/duck'
import { reducer as contributors } from 'contributors/duck'
import { reducer as photos } from 'photos/duck'
import { reducer as stories } from 'stories/duck'
import { reducer as storytypes } from 'storytypes/duck'
import { reducer as user } from 'user/duck'

export default { issues, contributors, photos, stories, storytypes, user }
