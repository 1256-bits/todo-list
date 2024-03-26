import createTodoObject from './createTodoObject'
import { projectList } from './index'
import { TodoItem } from './classes'
import { listTodos } from './dom'
import parseDate from './parseDate'
import getCurrentProjectId from './getCurrentProjectId'
import getIdFromEvent from './getIdFromEvent'

export function createTodoHandler (e: Event): void {
  const targetForm = e.target as HTMLFormElement
  const formData = new FormData(targetForm)
  const initParams = createTodoObject(formData)
  const currentProjectId = getCurrentProjectId()

  const currentProject = projectList.getProject(currentProjectId)
  currentProject.addItem(new TodoItem(initParams))
  targetForm.reset()
  listTodos(currentProjectId)
}

export function newTodoBtnClickHandler (): void {
  const newTodoDialog = document.getElementById('new-todo-dialog') as HTMLDialogElement
  const submitBtn = document.querySelector('#create-todo') as HTMLButtonElement
  const dateStarted = newTodoDialog.querySelector('input[name="dateStarted"]')
  const form = newTodoDialog.querySelector('form')
  if (dateStarted instanceof HTMLInputElement) {
    const date = new Date()
    const newDate = parseDate(date)
    if (typeof newDate === 'string') {
      dateStarted.value = newDate
    }
  }
  submitBtn.textContent = 'Create todo'
  form?.addEventListener('submit', createTodoHandler, { once: true })
  newTodoDialog.addEventListener('close', () => {
    form?.removeEventListener('submit', createTodoHandler)
  }, { once: true })
  newTodoDialog.showModal()
}

export function editTodoItem (e: Event): void {
  const dialog = document.querySelector('#new-todo-dialog')
  const saveBtn = dialog?.querySelector('#create-todo')
  const form = dialog?.querySelector('form')
  const id = getIdFromEvent(e)
  if (!(dialog instanceof HTMLDialogElement) || !(saveBtn instanceof HTMLButtonElement)) {
    throw new Error('Dialog or button not found')
  }
  assignValues(id, dialog)
  saveBtn.textContent = 'Save'
  const editTodoHandlerCallback = editTodoHandler.bind({}, id)
  form?.addEventListener('submit', editTodoHandlerCallback, { once: true })
  dialog.addEventListener('close', () => {
    form?.removeEventListener('submit', editTodoHandlerCallback)
  }, { once: true })

  dialog.showModal()
}

export function editTodoHandler (id: string, e: Event): void {
  const form = e.target as HTMLFormElement
  const formData = new FormData(form)
  const todoObject = createTodoObject(formData)

  const projectId = getCurrentProjectId()
  const project = projectList.getProject(projectId)
  const todo = project.getItem(id)
  todo.updateFields(todoObject)

  listTodos(projectId)
}

function assignValues (id: string, dialog: HTMLDialogElement): void {
  const projectId = getCurrentProjectId()
  const todo = projectList.getProject(projectId).getItem(id)

  const title = dialog.querySelector('input[name="title"]') as HTMLInputElement
  const description = dialog.querySelector('input[name="description"]') as HTMLInputElement
  const dueDate = dialog.querySelector('input[name="dueDate"]') as HTMLInputElement
  const dateStarted = dialog.querySelector('input[name="dateStarted"]') as HTMLInputElement
  const priority = dialog.querySelector(`fieldset input[value="${todo.priority}"]`) as HTMLInputElement
  const notes = dialog.querySelector('textarea') as HTMLTextAreaElement

  title.value = todo.title
  description.value = todo.description

  if (todo.dueDate != null) {
    const newDueDate = parseDate(todo.dueDate)
    if (typeof newDueDate === 'string') {
      dueDate.value = newDueDate
    }
  }

  const newDateStarted = parseDate(todo.dateStarted)
  if (typeof newDateStarted === 'string') {
    dateStarted.value = newDateStarted
  }
  priority.checked = true
  notes.value = todo.notes
}

export function deleteTodoItem (e: Event): void {
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  if (id == null) {
    return
  }
  const conf = confirm('Are you sure?')
  const projectId = getCurrentProjectId()
  if (conf) {
    projectList.getProject(projectId).removeItem(id)
    listTodos(projectId)
  }
}

export function showNotesHandler (e: Event): void {
  const id = getIdFromEvent(e)
  const projectId = getCurrentProjectId()
  const todo = projectList.getProject(projectId).getItem(id)
  const notes = todo.notes
  const dialog = document.querySelector('#notes-dialog')
  if (!(dialog instanceof HTMLDialogElement)) {
    throw new Error('Dialog not found')
  }
  const form = dialog.querySelector('form')
  const textarea = dialog.querySelector('textarea')
  if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new Error('Textarea not found')
  }
  textarea.value = notes

  const callback = updateNotesHandler.bind(todo)

  dialog.showModal()
  form?.addEventListener('submit', callback, { once: true })
  dialog.addEventListener('close', () => {
    form?.removeEventListener('submit', callback)
  }, { once: true })
}

function updateNotesHandler (this: TodoItem, e: Event): void {
  const target = e.target as HTMLFormElement
  const formData = new FormData(target)
  const newNotes = formData.get('notes')
  if (typeof newNotes === 'string') {
    this.updataNotes(newNotes)
    return
  }
  throw new Error('Could not retrieve notes from form')
}
