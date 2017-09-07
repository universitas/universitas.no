import { combineReducers } from 'redux'

import { reducer as issues } from 'issues/duck'
import { reducer as contributors } from 'contributors/duck'
import { reducer as photos } from 'photos/duck'
import { reducer as stories } from 'stories/duck'
import { reducer as storytypes } from 'storytypes/duck'
import { reducer as auth } from 'auth/duck'
import { reducer as errors } from 'error/duck'

export default {
  auth,
  issues,
  contributors,
  photos,
  stories,
  storytypes,
  errors,
}
