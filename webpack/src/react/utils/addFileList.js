// Allows files to be added to jsdom input elements.

import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import { JSDOM } from 'jsdom'

export function addFileList(input, file_paths) {
  if (typeof file_paths === 'string') file_paths = [file_paths]
  else if (!Array.isArray(file_paths))
    throw new Error(
      'file_paths needs to be a file path string or an Array of file path strings'
    )

  const file_list = file_paths.map(fp => createFile(fp))
  file_list.__proto__ = Object.create(FileList.prototype)

  Object.defineProperty(input, 'files', {
    value: file_list,
    writeable: false,
  })
  return input
}

export const createFile = file_path => {
  const { mtimeMs: lastModified } = fs.statSync(file_path)
  const content = fs.readFileSync(file_path)
  return new File([content], path.basename(file_path), {
    lastModified,
    type: mime.lookup(file_path) || '',
  })
}
