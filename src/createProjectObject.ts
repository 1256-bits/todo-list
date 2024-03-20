import { type ProjectObject } from './interfaces'
import { v4 as uuid } from 'uuid'

export default function createProjectObject (formData: FormData): ProjectObject {
  const title = getTitle(formData.get('title'), 'New Project')
  const id = uuid()
  return { title, id }
}

function getTitle (dataTitle: FormDataEntryValue | null, defTitle: string): string {
  if (dataTitle != null && typeof dataTitle === 'string') {
    return dataTitle
  }
  return defTitle
}
