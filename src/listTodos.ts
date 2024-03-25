import { type TodoItem } from './classes'
import { projectList } from './index'
import createButtonElement from './createButtonElement'
import { type priority, type checklistItem } from './interfaces'
import * as DOM from './dom'
import getIdFromEvent from './getIdFromEvent'
import parseDate from './parseDate'
import getCurrentProjectId from './getCurrentProjectId'

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

  const container = document.createElement('div')
  container.classList.add('container')
  const done = createCheckbox(item)
  const doneLabelHidden = createCheckboxLabel()
  const name = createNameField(item.title)
  const priority = createPriorityElement(item.priority)
  const notes = createButtonElement('notes', 'View notes')
  const addBtn = createButtonElement('add', 'New checklist item')
  const renameBtn = createButtonElement('rename', 'Edit')
  const deleteBtn = createButtonElement('delete', 'Delete')
  addBtn.addEventListener('click', DOM.addChecklistItem)
  renameBtn.addEventListener('click', editTodoItem)
  deleteBtn.addEventListener('click', deleteTodoItem)
  container.append(priority, done, doneLabelHidden)

  if (item.checklist.length > 0) {
    const checklist = createChecklist(item.checklist, item.id)
    todoItem.append(container, name, notes, addBtn, renameBtn, deleteBtn, checklist)
    return todoItem
  }

  todoItem.append(container, name, notes, addBtn, renameBtn, deleteBtn)
  return todoItem
}

function createChecklist (checklist: checklistItem[], parentId: string): HTMLDivElement {
  const checklistElement = document.createElement('div')
  checklistElement.classList.add('checklist')

  const ul = document.createElement('ul')
  checklistElement.appendChild(ul)

  checklist.forEach(item => checklistElement.appendChild(createChecklistItem(item, parentId)))
  return checklistElement
}

function createChecklistItem (item: checklistItem, parentId: string): HTMLElement {
  const checklistItem = document.createElement('li')
  checklistItem.setAttribute('data-index', String(item.index))
  checklistItem.setAttribute('data-id', parentId)

  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.classList.add('checkbox-small')

  checkbox.addEventListener('change', e => {
    const target = e.target as HTMLInputElement
    const projectId = getCurrentProjectId()
    const todo = projectList.getProject(projectId).getItem(parentId)
    if (target.checked) {
      todo.checklistCheckItem(item.index)
    } else {
      todo.checklistUncheckItem(item.index)
    }
  })
  checkbox.checked = item.completed

  const label = document.createElement('label')
  label.innerText = item.text

  const closeBtn = createButtonElement('close', 'Remove')
  const renameBtn = createButtonElement('rename', 'Rename')
  closeBtn.addEventListener('click', DOM.deleteChecklistItem)
  renameBtn.addEventListener('click', DOM.renameChecklistItem)

  checklistItem.append(checkbox, label, renameBtn, closeBtn)
  return checklistItem
}

function createCheckbox (item: TodoItem): HTMLInputElement {
  const done = document.createElement('input')
  done.classList.add('checkbox-big')
  done.setAttribute('type', 'checkbox')
  done.setAttribute('name', 'done')
  done.addEventListener('change', e => {
    const target = e.target as HTMLInputElement
    if (target.checked) {
      item.checkTodo()
    } else {
      item.uncheckTodo()
    }
  })
  done.checked = item.done
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

function editTodoItem (e: Event): void {
  const dialog = document.querySelector('#new-todo-dialog')
  const saveBtn = dialog?.querySelector('#create-todo')
  const id = getIdFromEvent(e)
  if (!(dialog instanceof HTMLDialogElement) || !(saveBtn instanceof HTMLButtonElement)) {
    throw new Error('Dialog or button not found')
  }
  assignValues(id, dialog)
  saveBtn.textContent = 'Save'
  dialog.showModal()
}

function assignValues (id: string, dialog: HTMLDialogElement): void {
  const projectId = getCurrentProjectId()
  const todo = projectList.getProject(projectId).getItem(id)

  const title = dialog.querySelector('input[name="title"]') as HTMLInputElement
  const description = dialog.querySelector('input[name="description"]') as HTMLInputElement
  const dueDate = dialog.querySelector('input[name="dueDate"]') as HTMLInputElement
  const dateStarted = dialog.querySelector('input[name="dateStarted"]') as HTMLInputElement
  const priority = dialog.querySelector(`fieldset input[value="${todo.priority}"]`) as HTMLInputElement
  const notes = dialog.querySelector('textarea') as HTMLTextAreaElement

  title.value = todo.title
  description.value = todo.description
  if (todo.dueDate != null) {
    dueDate.value = parseDate(todo.dueDate)
  }
  dateStarted.value = parseDate(todo.dateStarted)
  priority.checked = true
  notes.value = todo.notes
}

function deleteTodoItem (e: Event): void {
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  if (id == null) {
    return
  }
  const conf = confirm('Are you sure?')
  const projectId = getCurrentProjectId()
  if (conf) {
    projectList.getProject(projectId).removeItem(id)
    listTodos(projectId)
  }
}

function createPriorityElement (priority: priority): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

  svg.setAttribute('viewBox', '0 0 20 20')
  svg.classList.add('priority')
  title.textContent = priority.slice(0, 1).toUpperCase() + priority.slice(1)
  use.setAttribute('href', `./svg/${priority}.svg#${priority}`)

  svg.append(title, use)
  return svg
}
