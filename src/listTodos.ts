import { type TodoItem } from './classes'
import { projectList } from './index'
import createButtonElement from './createButtonElement'
import { checklistItem } from './interfaces'

/* TODO:
  * Checklist:
    DONE List chekclist items
    TODO Make chekslist items deletable 
      * Get an X icon
    TODO Make chekclist items editable
  * Add index and id to todos/checklists
*/

export default function listTodos (e: Event): void {
  if (!(e.target instanceof HTMLElement) || e.target.dataset.id == null) {
    console.error('listTodos: not an HTML element or missing ID')
    return
  }
  const todoArea = document.querySelector('main > ul')
  const id = e.target.dataset.id
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
  // Set new id and display new todo items
  todoArea?.setAttribute('data-project-id', id)
  const project = projectList.items.filter(item => item.id === id)[0]
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
  checklistItem.append(checkbox, label)
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
