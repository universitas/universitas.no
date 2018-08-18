export const ASSIGN_PHOTO = 'storyimage/ASSIGN_PHOTO'
export const DELETE_STORY_IMAGE = 'storyimage/DELETE_STORY_IMAGE'
export const PUSH_PHOTO = 'storyimage/PUSH_PHOTO'

export const assignPhoto = (id, story) => ({
  type: ASSIGN_PHOTO,
  payload: { id, story },
})
export const deleteStoryImage = id => ({
  type: DELETE_STORY_IMAGE,
  payload: { id },
})
export const pushPhoto = id => ({
  type: PUSH_PHOTO,
  payload: { id },
})
