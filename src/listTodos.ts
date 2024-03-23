import { type TodoItem } from './classes'
import { projectList } from './index'
import createButtonElement from './createButtonElement'
import { type checklistItem } from './interfaces'
import { addChecklistItem, renameChecklistItem, deleteChecklistItem } from './dom'

export default function listTodos (id: string): void {
  const todoArea = document.querySelector('main > ul')

  // Remove all currenlty displayed todo items. Leave 'No items available' banner.
  if (todoArea != null) {
    const children = Array.from(todoArea.children).filter(child => !child.classList.contains('no-todos'))
    children.forEach(child => {
      todoArea?.removeChild(child)
    })
  }

  // Save current id to localStorage
  localStorage.setItem('currentProjectId', id)

  const project = projectList.getProject(id)
  project.items.forEach(item => {
    todoArea?.appendChild(createTodoNode(item))
  })

  // Update project name
  const titleElement = document.querySelector('.project-header > h2') as HTMLElement
  const headerRenameBtn = document.querySelector('.project-header > .rename-button')
  const headerDeleteBtn = document.querySelector('.project-header > .delete-button')
  titleElement.innerText = project.title
  headerRenameBtn?.setAttribute('data-id', id)
  headerDeleteBtn?.setAttribute('data-id', id)
}

function createTodoNode (item: TodoItem): HTMLLIElement {
  const todoItem = document.createElement('li')
  todoItem.classList.add('todo-item')
  todoItem.setAttribute('data-id', item.id)

  const done = createCheckbox()
  const doneLabelHidden = createCheckboxLabel()
  const name = createNameField(item.title)
  const addBtn = createButtonElement('add', 'New checklist item')
  const renameBtn = createButtonElement('rename', 'Edit')
  const deleteBtn = createButtonElement('delete', 'Delete')
  addBtn.addEventListener('click', addChecklistItem)
  renameBtn.addEventListener('click', editTodoItem)
  deleteBtn.addEventListener('click', deleteTodoItem)

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

  const closeBtn = createButtonElement('close', 'Remove')
  const renameBtn = createButtonElement('rename', 'Rename')
  closeBtn.addEventListener('click', deleteChecklistItem)
  renameBtn.addEventListener('click', renameChecklistItem)

  checklistItem.append(checkbox, label, renameBtn, closeBtn)
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

function editTodoItem (): void {
}

function deleteTodoItem (): void {
}
