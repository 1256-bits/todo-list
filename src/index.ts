import { TodoItem, Project, ProjectList } from './classes'
// import { type priority, type TodoObject, type checklistItem } from './interfaces'
import createTodoObject from './createTodoObject'
import 'normalize.css'

const form = document.querySelector('form') as HTMLFormElement
form.addEventListener('submit', e => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const initParams = createTodoObject(formData)
  console.log(new TodoItem(initParams))
})
