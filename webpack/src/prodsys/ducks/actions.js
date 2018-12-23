import { getActionCreator } from './basemodel.js'

export const ASSIGN_PHOTO = 'storyimages/ASSIGN_PHOTO'
export const assignPhoto = getActionCreator(
  ASSIGN_PHOTO,
  (id, story) => ({ id, story }),
  'photos',
)

export const DELETE_STORY_IMAGE = 'storyimages/DELETE_STORY_IMAGE'
export const deleteStoryImage = getActionCreator(
  DELETE_STORY_IMAGE,
  id => ({ id }),
  'storyimages',
)

export const PUSH_PHOTO = 'photos/PUSH_PHOTO'
export const pushPhoto = getActionCreator(PUSH_PHOTO, id => ({ id }), 'photos')
