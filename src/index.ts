import { TodoItem, Project, ProjectList } from './classes'
import createTodoObject from './createTodoObject'
import { v4 as uuid } from 'uuid'
import * as DOM from './dom'
import 'normalize.css'
import './styles.scss'

const projectList = new ProjectList()
const projectUL = document.querySelector('nav > ul')

/*
const form = document.querySelector('#new-todo')
form?.addEventListener('submit', e => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const initParams = createTodoObject(formData)
  project.addItem(new TodoItem(initParams))
})

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

// LIST PROJECTS IN NAV
projectList.items.forEach(item => {
  projectUL?.appendChild(DOM.createProjectItem(item))
})

// LIST TODOS. BUG?
const projectNameBtns = document.querySelectorAll('.project-name')
projectNameBtns.forEach(name => {
  name.addEventListener('click', e => {
    DOM.listTodos(e)
  })
})

if (projectList.items.length === 0) {
  const project = new Project('default', 0)
  projectList.addProject(project)
}

export { projectList }
