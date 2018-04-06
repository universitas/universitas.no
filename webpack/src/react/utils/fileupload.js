// helpers for file inputs and upload

const isObjectURL = str => R.match(/^blob:https?\/\//)

// Turn serializable data into FormData. Fetches any object URLs
// :: object -> FormData
export const jsonToFormData = obj => {
  const form = new FormData()
  R.forEachObjIndexed((val, key) => form.set(key, val), obj)
  return form
}

export const objectURLtoFile = (url, filename) =>
  fetch(url)
    .then(r => r.blob())
    .then(b => new File([b], filename))
