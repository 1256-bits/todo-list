import { TodoItem, Project, ProjectList } from './classes'
import createTodoObject from './createTodoObject'
import createProjectObject from './createProjectObject'
import { v4 as uuid } from 'uuid'
import * as DOM from './dom'
import 'normalize.css'
import './styles.scss'

// TEMP
localStorage.clear()

const projectList = new ProjectList()

const form = document.querySelector('#new-todo-dialog')
form?.addEventListener('submit', e => {
  const targetForm = e.target as HTMLFormElement
  const formData = new FormData(targetForm)
  const initParams = createTodoObject(formData)
  const currentProjectId = getCurrentProjectId()

  const currentProject = projectList.getProject(currentProjectId)
  currentProject.addItem(new TodoItem(initParams))
  targetForm.reset()
  DOM.listTodos(currentProjectId)
})

const newProjectForm = document.querySelector('#new-project-form')
newProjectForm?.addEventListener('submit', e => {
  const targetForm = e.target as HTMLFormElement
  const formData = new FormData(targetForm)
  const { title, id } = createProjectObject(formData)
  const project = new Project(title, id)
  localStorage.setItem('currentProjectId', id)

  if (projectList.items.length === 0) {
    const addBtn = document.querySelector('.project-header .add-button') as HTMLButtonElement
    addBtn.disabled = false
  }

  projectList.addProject(project)
  targetForm.reset()
  DOM.listProjects()
  DOM.listTodos(getCurrentProjectId())
})

// DUMMY PROJECTS
projectList.addProject(new Project('Project 1', uuid()))
projectList.addProject(new Project('Project 2', uuid()))
projectList.addProject(new Project('Project 3', uuid()))

// DUMMY TODO WITH CHECKLISTS
const item = new TodoItem(createTodoObject(new FormData()))
item.addChecklistItem('Item 1')
item.addChecklistItem('Item 2')
projectList.items[0].addItem(item)
projectList.items[0].addItem(new TodoItem(createTodoObject(new FormData())))

// LIST PROJECTS IN NAV
DOM.listProjects()

// ADD NEW TODO
const newTodoBtn = document.getElementById('new-todo')
const newTodoDialog = document.getElementById('new-todo-dialog') as HTMLDialogElement
newTodoBtn?.addEventListener('click', () => {
  const submitBtn = document.querySelector('#create-todo') as HTMLButtonElement
  const dateStarted = newTodoDialog.querySelector('input[name="dateStarted"]')
  if (dateStarted instanceof HTMLInputElement) {
    const date = new Date()
    dateStarted.value = parseDate(date)
  }
  submitBtn.textContent = 'Create todo'
  newTodoDialog.showModal()
})

// ADD NEW PROJECT

const newProjectBtn = document.getElementById('new-project-button')
const newProjectDialog = document.getElementById('new-project') as HTMLDialogElement
newProjectBtn?.addEventListener('click', () => { newProjectDialog.showModal() })

// CLOSE DIALOG

const dialogCloseBtns = document.querySelectorAll('#close-dialog')
dialogCloseBtns?.forEach(button => {
  button.addEventListener('click', () => {
    if (!(button instanceof HTMLElement) || button.dataset.dialogId == null) {
      return
    }
    const dialogId = button.dataset.dialogId
    const dialog = document.getElementById(dialogId) as HTMLDialogElement
    dialog.close()
  })
})

// Add empty default project if there are no projects present
// Or don't
/* if (projectList.items.length === 0) {
  const project = new Project('default', '0')
  projectList.addProject(project)
}
*/
// Automatically open last opened project or the first available project
function init (): void {
  const id = localStorage.getItem('currentProjectId')

  if (projectList.items.length === 0) {
    const addBtn = document.querySelector('.project-header .add-button') as HTMLButtonElement
    addBtn.disabled = true
    return
  }

  if (id == null) {
    DOM.listTodos(projectList.items[0].id)
    return
  }
  DOM.listTodos(id)
}

function getCurrentProjectId (): string {
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId == null) {
    throw new Error('Missing current project ID')
  }
  return projectId
}

function parseDate (date: Date): string {
  const year = date.getFullYear()
  const processRaw = (raw: number) => {
    const rawStr = String(raw)
    return (rawStr.length === 1) ? '0' + rawStr : rawStr
  }
  // only months are counted from 0
  const month = processRaw(date.getMonth() + 1)
  const day = processRaw(date.getDate())
  const hour = processRaw(date.getHours())
  const minute = processRaw(date.getMinutes())
  return `${year}-${month}-${day}T${hour}:${minute}`
}

init()

export { projectList, getCurrentProjectId, parseDate }
