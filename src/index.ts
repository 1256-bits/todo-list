import { ProjectList } from './classes'
import * as DOM from './dom'
import 'normalize.css'
import './styles.scss'

export const projectList = new ProjectList()

const exportBtn = document.querySelector('.import')
const importBtn = document.querySelector('.import')
exportBtn?.addEventListener('click', DOM.exportHandler)

const newTodoBtn = document.getElementById('new-todo')
newTodoBtn?.addEventListener('click', DOM.newTodoBtnClickHandler)

const newProjectForm = document.querySelector('#new-project-form')
newProjectForm?.addEventListener('submit', DOM.newProjectHandler)

const headerRenameBtn = document.querySelector('.project-header > .rename-button')
const headerDeleteBtn = document.querySelector('.project-header > .delete-button')
headerRenameBtn?.addEventListener('click', DOM.renameHandler)
headerDeleteBtn?.addEventListener('click', DOM.deleteProject)

const newProjectBtn = document.getElementById('new-project-button')
const newProjectDialog = document.getElementById('new-project') as HTMLDialogElement
newProjectBtn?.addEventListener('click', () => { newProjectDialog.showModal() })

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
    const form = dialog.querySelector('form') as HTMLFormElement
    form.reset()
  })
})

function init (): void {
  const id = localStorage.getItem('currentProjectId')
  projectList.restore()

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
