import { TodoItem, Project, ProjectList } from './classes'
import createTodoObject from './createTodoObject'
import { v4 as uuid } from 'uuid'
import * as DOM from './dom'
import 'normalize.css'
import './styles.scss'

const projectList = new ProjectList()
const projectUL = document.querySelector('nav > ul')

const form = document.querySelector('#new-todo-dialog')
form?.addEventListener('submit', e => {
  const formData = new FormData(e.target as HTMLFormElement)
  const initParams = createTodoObject(formData)
  const currentProjectId = localStorage.getItem('currentProjectId')
  
  if (currentProjectId == null) {
    console.error("Can't add projects while no project is active. What are you doing?")
    return
  }
  const currentProject = projectList.getProject(currentProjectId)
  currentProject.addItem(new TodoItem(initParams))
})

/*
const newProject = document.querySelector('#new-project')
newProject?.addEventListener('submit', form => {
  form.preventDefault()
  const formData = new FormData(form.target as HTMLFormElement)
  const sanitize = (data: FormDataEntryValue | null): string => (data !== '' && typeof data === 'string') ? data : 'New project'
  const project = new Project(sanitize(formData.get('title')), Date.now())
  projectList.addProject(project)
})
*/

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
projectList.items.forEach(item => {
  projectUL?.appendChild(DOM.createProjectItem(item))
})

// LIST TODOS.
const projectNameBtns = document.querySelectorAll('.project-name')
projectNameBtns.forEach(name => {
  name.addEventListener('click', e => {
    DOM.listTodos(e)
  })
})

// ADD NEW TODO

const newTodoBtn = document.getElementById('new-todo')
const newTodoDialog = document.getElementById('new-todo-dialog') as HTMLDialogElement
newTodoBtn?.addEventListener('click', () => newTodoDialog.showModal())

// CLOSE DIALOG

const dialogCloseBtn = document.getElementById('close-dialog')
dialogCloseBtn?.addEventListener('click', () => {
  const newTodoDialog = document.getElementById('new-todo-dialog') as HTMLDialogElement
  newTodoDialog.close()
})

// Add empty default project if there are no projects present

if (projectList.items.length === 0) {
  const project = new Project('default', '0')
  projectList.addProject(project)
}

// Automatically open last opened project or the first available project

projectList.items[0]

export { projectList }
