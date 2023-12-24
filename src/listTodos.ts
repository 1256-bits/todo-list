import { type TodoItem } from './classes'
import { projectList } from './index'
import createButtonElement from './createButtonElement'

export default function listTodos (e: Event): void {
  if (!(e.target instanceof HTMLElement) || e.target.dataset.id == null) {
    console.error('listTodos: not an HTML element or missing ID')
    return
  }
  const todoArea = document.querySelector('main > ul')
  const id = parseInt(e.target.dataset.id)
  const project = projectList.items.filter(item => item.id === id)[0]
  project.items.forEach(item => {
    todoArea?.appendChild(createTodo(item))
  })
}

function createTodo (item: TodoItem): HTMLLIElement {
  const todoItem = document.createElement('li')
  todoItem.classList.add('todo-item')

  const done = createCheckbox()
  const doneLabelHidden = createCheckboxLabel()
  const name = createNameField(item.title)
  const addBtn = createButtonElement('add')
  const renameBtn = createButtonElement('rename')
  const deleteBtn = createButtonElement('delete')

  todoItem.append(done, doneLabelHidden, name, addBtn, renameBtn, deleteBtn)
  return todoItem
}

function createCheckbox (): HTMLInputElement {
  const done = document.createElement('input')
  done.setAttribute('type', 'checkbox')
  done.setAttribute('name', 'done')

  return done
}

function createCheckboxLabel (): HTMLLabelElement {
  const label = document.createElement('label')
  label.setAttribute('for', 'done')
  label.classList.add('hidden')
  label.innerText = 'Done'

  return label
}

function createNameField (title: string): HTMLInputElement {
  const name = document.createElement('input')
  name.classList.add('todo-name')
  name.readOnly = true
  name.value = title

  return name
}
