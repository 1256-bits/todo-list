import { type TodoItem } from './classes'
import { projectList } from './index'
import createButtonElement from './createButtonElement'
import { type priority, type checklistItem } from './interfaces'
import * as DOM from './dom'
import getCurrentProjectId from './getCurrentProjectId'
import parseDate from './parseDate'

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
  const dueDate = createDueDateElement(item.dueDate, item.done)
  const notes = createButtonElement('notes', 'View notes')
  const addBtn = createButtonElement('add', 'New checklist item')
  const renameBtn = createButtonElement('rename', 'Edit')
  const deleteBtn = createButtonElement('delete', 'Delete')
  addBtn.addEventListener('click', DOM.addChecklistItem)
  renameBtn.addEventListener('click', DOM.editTodoItem)
  deleteBtn.addEventListener('click', DOM.deleteTodoItem)
  notes.addEventListener('click', DOM.showNotesHandler)
  container.append(priority, done, doneLabelHidden)

  if (item.checklist.length > 0) {
    const checklist = createChecklist(item.checklist, item.id)
    todoItem.append(container, name, dueDate, notes, addBtn, renameBtn, deleteBtn, checklist)
    return todoItem
  }

  todoItem.append(container, name, dueDate, notes, addBtn, renameBtn, deleteBtn)
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
    const projectId = getCurrentProjectId()
    const dueDateElement = document.querySelector(`[data-id="${item.id}"] .due-date`)
    const target = e.target as HTMLInputElement
    if (target.checked) {
      item.checkTodo()
      dueDateElement?.classList.add('hidden')
      listTodos(projectId)
    } else {
      item.uncheckTodo()
      listTodos(projectId)
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

function createDueDateElement (date: Date | null, done: boolean): HTMLDivElement {
  const div = document.createElement('div')
  div.classList.add('due-date')

  if (date == null || done) {
    return div
  }

  const dateDiv = document.createElement('div')
  const timeDiv = document.createElement('div')
  const dateStringArr = parseDate(date, true)
  const dueTimestamp = date.getTime()
  const curTimestamp = Date.now()

  dateDiv.textContent = dateStringArr[0]
  timeDiv.textContent = dateStringArr[1]
  div.append(dateDiv, timeDiv)

  if (dueTimestamp - curTimestamp < 0) {
    const overdue = document.createElement('div')
    overdue.classList.add('overdue-notice')
    overdue.textContent = 'Overdue'
    div.appendChild(overdue)
  }
  return div
}
