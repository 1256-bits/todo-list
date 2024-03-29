import { type TodoObject, type checklistItem, type priority } from './interfaces'
import { v4 as uuid } from 'uuid'
export default function createTodoObject (formData: FormData): TodoObject {
  const title = getStringParam(formData.get('title'), 'New task')
  const description = getStringParam(formData.get('description'), '')
  const dueDate = getDateParam(formData.get('dueDate'), null)
  const dateStarted = new Date() // Generate it here for testing purposes but ideally on class instance
  const priority = getPriority(formData.get('priority'), 'normal')
  const notes = getStringParam(formData.get('notes'), '')
  const checklist: checklistItem[] = []
  const id = uuid()
  const done = getBoolean(formData.get('done'), false)
  return { title, description, dueDate, dateStarted, priority, notes, checklist, id, done }
}

function getStringParam (param: FormDataEntryValue | null, defParam: string): string {
  return (param === '' || param == null) ? defParam : String(param)
}

function getDateParam (param: FormDataEntryValue | null, defParam: Date | null): Date | null {
  return (param == null || typeof param !== 'string' || param === '') ? defParam : new Date(param)
}

function getPriority (param: FormDataEntryValue | null, defParam: priority): priority {
  const priorityList: priority[] = ['low', 'normal', 'high']
  if (priorityList.includes(param as priority)) {
    return param as priority
  }
  return defParam
}

function getBoolean (param: FormDataEntryValue | null, defParam: boolean): boolean {
  switch (param) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return defParam
  }
}
