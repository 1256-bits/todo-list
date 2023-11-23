import { type TodoObject, type checklistItem, type priority } from './interfaces'
export default function createTodoObject (formData: FormData): TodoObject {
  const title = getStringParam(formData.get('title'), 'New task')
  const description = getStringParam(formData.get('title'), '')
  const dueDate = getDateParam(formData.get('dueDate'), null)
  const dateStarted = new Date() // Generate it here for testing purposes but ideally on class instance
  const priority = getPriority(formData.get('priority'), 'normal')
  const notes = ''
  const checklist: checklistItem[] = []
  return { title, description, dueDate, dateStarted, priority, notes, checklist }
}

function getStringParam (param: FormDataEntryValue | null, defParam: string): string {
  if (!param) {
    return defParam
  }
  return String(param)
}

function getDateParam (param: FormDataEntryValue | null, defParam: Date | null): Date | null {
  if (param && typeof param === 'string') {
    return new Date(param)
  }
  return defParam
}

function getPriority (param: FormDataEntryValue | null, defParam: priority): priority {
  const priorityList: priority[] = ['low', 'normal', 'high']
  if (priorityList.includes(param as priority)) {
    return param as priority
  }
  return defParam
}
