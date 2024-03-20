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
  const currentProjectId = localStorage.getItem('currentProjectId')

  if (currentProjectId == null) {
    console.error("Can't add todos while no project is active. What are you doing?")
    return
  }
  const currentProject = projectList.getProject(currentProjectId)
  currentProject.addItem(new TodoItem(initParams))
  targetForm.reset()
  DOM.listTodos(currentProjectId)
})

const newProjectForm = document.querySelector('#new-project-form')
newProjectForm?.addEventListener('submit', e => {
  const formData = new FormData(e.target as HTMLFormElement)
  const { title, id } = createProjectObject(formData)
  const project = new Project(title, id)
  localStorage.setItem('currentProjectId', id)
  projectList.addProject(project)
  DOM.listProjects()
  DOM.listTodos(localStorage.getItem('currentProjectId') as string)
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
newTodoBtn?.addEventListener('click', () => { newTodoDialog.showModal() })

// ADD NEW PROJECT
// NB: repurpose for new project + new checklist
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
  if (id == null) {
    DOM.listTodos(projectList.items[0].id)
    return
  }
  DOM.listTodos(id)
}

init()

export { projectList }
