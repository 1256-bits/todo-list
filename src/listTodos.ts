import { type TodoItem } from './classes'
import { projectList } from './index'
import createButtonElement from './createButtonElement'
import { type checklistItem } from './interfaces'

export default function listTodos (id: string): void {
  const todoArea = document.querySelector('main > ul')
  // If the same project selecteda gain - do nothing
  if (todoArea?.getAttribute('data-project-id') === id) {
    return
  }

  // Remove all currenlty displayed todo items. Leave 'No items available' banner.
  if (todoArea != null) {
    const children = Array.from(todoArea.children).filter(child => !child.classList.contains('no-todos'))
    children.forEach(child => {
      todoArea?.removeChild(child)
    })
  }

  // Save current id to localStorage
  localStorage.setItem('currentProjectId', id)

  // Set new id and display new todo items
  // ID is stored in DOM in case I for some reason need to change it in localStorage without relisting todo
  // Potential bugs ahead
  // NB: remove it if I end up not needing it
  todoArea?.setAttribute('data-project-id', id)

  const project = projectList.getProject(id)
  project.items.forEach(item => {
    todoArea?.appendChild(createTodoNode(item))
  })
}

function createTodoNode (item: TodoItem): HTMLLIElement {
  const todoItem = document.createElement('li')
  todoItem.classList.add('todo-item')

  const done = createCheckbox()
  const doneLabelHidden = createCheckboxLabel()
  const name = createNameField(item.title)
  const addBtn = createButtonElement('add')
  const renameBtn = createButtonElement('rename')
  const deleteBtn = createButtonElement('delete')

  if (item.checklist.length > 0) {
    const checklist = createChecklist(item.checklist)
    todoItem.append(done, doneLabelHidden, name, addBtn, renameBtn, deleteBtn, checklist)
    return todoItem
  }

  todoItem.append(done, doneLabelHidden, name, addBtn, renameBtn, deleteBtn)
  return todoItem
}

function createChecklist (checklist: checklistItem[]): HTMLDivElement {
  const checklistElement = document.createElement('div')
  checklistElement.classList.add('checklist')

  const ul = document.createElement('ul')
  checklistElement.appendChild(ul)

  checklist.forEach(item => checklistElement.appendChild(createChecklistItem(item)))
  return checklistElement
}

function createChecklistItem (item: checklistItem): HTMLElement {
  const checklistItem = document.createElement('li')

  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')

  const label = document.createElement('label')
  label.innerText = item.text

  const closeBtn = createButtonElement('close')

  checklistItem.append(checkbox, label, closeBtn)
  return checklistItem
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

export function getIdFromEvent (e: Event): string {
  if (!(e.target instanceof HTMLElement) || e.target.dataset.id == null) {
    throw new Error('listTodos: not an HTML element or missing ID')
  }
  const id = e.target.dataset.id
  return id
}
