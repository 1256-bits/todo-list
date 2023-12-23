import { type ProjectList, type TodoItem } from './classes'
// import createIcon from './create-icon'
declare const projectList: ProjectList

export default function listTodos (e: Event): void {
  if (!(e.target instanceof HTMLElement) || e.target.dataset.id == null) {
    console.error('listTodos: not an HTML element or missing ID')
    return
  }
  const id = parseInt(e.target.dataset.id)
  const project = projectList.items.filter(item => item.id === id)[0]
  project.items.forEach(item => {
    displayTodo(item)
  })
}

function displayTodo (item: TodoItem): void {
  /*
  const todoArea = document.querySelector('main > ul')
  const todoItem = document.createElement('li')
  const done = document.createElement('input')
  const doneLabelHidden = document.createElement('label')
  */
  // const addButton = createAddButton()
}
