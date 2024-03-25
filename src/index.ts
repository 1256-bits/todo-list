import { TodoItem, Project, ProjectList } from './classes'
import createTodoObject from './createTodoObject'
import { v4 as uuid } from 'uuid'
import * as DOM from './dom'
import 'normalize.css'
import './styles.scss'

// TEMP
localStorage.clear()

export const projectList = new ProjectList()

const newTodoBtn = document.getElementById('new-todo')
newTodoBtn?.addEventListener('click', DOM.newTodoBtnClickHandler)

const newProjectForm = document.querySelector('#new-project-form')
newProjectForm?.addEventListener('submit', DOM.newProjectHandler)

const headerRenameBtn = document.querySelector('.project-header > .rename-button')
const headerDeleteBtn = document.querySelector('.project-header > .delete-button')
headerRenameBtn?.addEventListener('click', DOM.renameHandler)
headerDeleteBtn?.addEventListener('click', DOM.deleteProject)

// DUMMY PROJECTS
projectList.addProject(new Project('Project 1', uuid()))
projectList.addProject(new Project('Project 2', uuid()))
projectList.addProject(new Project('Project 3', uuid()))

// DUMMY TODO WITH CHECKLISTS
const item = new TodoItem(createTodoObject(new FormData()))
item.addChecklistItem('Item 1')
item.addChecklistItem('Item 2')
projectList.items[0].addItem(item)
projectList.items[0].addItem(new TodoItem(createTodoObject(new FormData())))

// ADD NEW TODO
// ADD NEW PROJECT

const newProjectBtn = document.getElementById('new-project-button')
const newProjectDialog = document.getElementById('new-project') as HTMLDialogElement
newProjectBtn?.addEventListener('click', () => { newProjectDialog.showModal() })

// CLOSE DIALOG

const dialogCloseBtns = document.querySelectorAll('#close-dialog')
dialogCloseBtns?.forEach(button => {
  button.addEventListener('click', () => {
    if (!(button instanceof HTMLElement) || button.dataset.dialogId == null) {
      return
    }
    const dialogId = button.dataset.dialogId
    const dialog = document.getElementById(dialogId) as HTMLDialogElement
    dialog.close()
  })
})
const dialogs = document.querySelectorAll('dialog')
dialogs.forEach(dialog => {
  dialog.addEventListener('close', () => {
    const dialogId = dialog.id
    const form = dialog.querySelector('form') as HTMLFormElement
    if (dialogId === '#new-todo-dialog') {
      form.removeEventListener('submit', DOM.createTodoHandler)
      //form.removeEventListener('submit', renameTodoHandler)
    }
    form.reset()
  })
})

function init (): void {
  const id = localStorage.getItem('currentProjectId')

  if (projectList.items.length === 0) {
    const addBtn = document.querySelector('.project-header .add-button') as HTMLButtonElement
    addBtn.disabled = true
    return
  }
  DOM.listProjects()

  if (id == null) {
    DOM.listTodos(projectList.items[0].id)
    return
  }
  DOM.listTodos(id)
}

init()
