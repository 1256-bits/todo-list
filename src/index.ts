import { TodoItem, Project, ProjectList } from './classes'
// import { type priority, type TodoObject, type checklistItem } from './interfaces'
import createTodoObject from './createTodoObject'
import 'normalize.css'

const projectList = new ProjectList()
const project = new Project('default', 0)
projectList.addProject(project)

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
  const sanitize = (data: FormDataEntryValue | null): string => (data !== "" && data) ? String(data) : 'New project'
  const project = new Project(sanitize(formData.get('title')), Date.now())
  projectList.addProject(project)
})

const listProjects = document.querySelector('#list-projects')
listProjects?.addEventListener('click', () => {
  const json = JSON.stringify(projectList)
  const newPL = new ProjectList()
  newPL.fromJSON(json)
  console.log(newPL)
})
