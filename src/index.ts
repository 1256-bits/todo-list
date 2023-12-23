import { TodoItem, Project, ProjectList } from './classes'
// import { type priority, type TodoObject, type checklistItem } from './interfaces'
// import * as DOM from './dom'
import createTodoObject from './createTodoObject'
import createProjectItem from './project-item'
import 'normalize.css'
import './styles.scss'

const projectList = new ProjectList()

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

const listProjects = document.querySelector('#list-projects')
// listProjects?.addEventListener('click', DOM.listProjects)

projectList.addProject(new Project('Project 1', Date.now()))
projectList.addProject(new Project('Project 2', Date.now()))
projectList.addProject(new Project('Project 3', Date.now()))

const item = new TodoItem(createTodoObject(new FormData))
item.adddChecklistItem('Item 1')
item.adddChecklistItem('Item 2')
projectList.items[0].addItem(item)

const projectUL = document.querySelector('nav > ul')
projectList.items.forEach(item => projectUL?.appendChild(createProjectItem(item)))
//const projectNames = document.querySelectorAll('project-name')
//projectNames.forEach(name => name.addEventListener('click', name => )

if (projectList.items.length === 0) {
  const project = new Project('default', 0)
  projectList.addProject(project)
}
