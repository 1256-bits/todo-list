import createTodoObject from './createTodoObject'
import { projectList } from './index'
import { TodoItem } from './classes'
import { listTodos } from './dom'
import parseDate from './parseDate'
import getCurrentProjectId from './getCurrentProjectId'

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
    dateStarted.value = parseDate(date)
  }
  submitBtn.textContent = 'Create todo'
  form?.addEventListener('submit', createTodoHandler, { once: true })
  newTodoDialog.showModal()
}
