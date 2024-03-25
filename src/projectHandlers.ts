import { projectList } from './index'
import getIdFromEvent from './getIdFromEvent'
import * as DOM from './dom'

export function renameHandler (e: Event): void {
  if (projectList.items.length === 0) {
    console.log('No projects available. Aborting')
    return
  }

  const id = getIdFromEvent(e)
  const title = projectList.getProject(id).title

  const dialog = document.querySelector('#rename-project') as HTMLDialogElement
  const input = dialog.querySelector('input')
  if (input != null) {
    input.value = title
  }
  input?.addEventListener('focus', () => {
    input.selectionStart = input.selectionEnd = input.value.length
  })
  dialog?.showModal()

  const form = document.querySelector('#rename-project-form') as HTMLFormElement
  form.addEventListener('submit', e => {
    renameProject(e, id)
  }, { once: true })
}

function renameProject (e: Event, id: string): void {
  const target = e.target
  if (target == null || !(target instanceof HTMLFormElement)) {
    console.error('renameProject: something went wrong')
    return
  }

  const formData = new FormData(target)
  const title = formData.get('title') as string
  if (title == null || title.length < 1) {
    console.error(`Illegal title: ${title}`)
    return
  }

  const project = projectList.getProject(id)
  project.title = title
  DOM.listProjects()

  const titleBar = document.querySelector('.project-header > h2')
  if (id === localStorage.getItem('currentProjectId') && titleBar != null) {
    titleBar.textContent = title
  }

  target.reset()
}

export function deleteProject (e: Event): void {
  const target = e.currentTarget as HTMLElement
  const id = target.dataset.id as string
  const currentProjectId = localStorage.getItem('currentProjectId')
  if (currentProjectId == null) {
    console.log('No projects available. Aborting.')
    return
  }
  const projectIndex = projectList.getProjectIndexById(id)
  const projectTitle = projectList.getProject(id).title
  const confirmation = confirm(`Are you sure you want to delete ${projectTitle}`)
  if (confirmation) {
    if (id === currentProjectId && projectList.items.length > 1) {
      const newIndex = (projectList.items.length > projectIndex + 1) ? projectIndex + 1 : projectIndex - 1
      const newId = projectList.items[newIndex].id
      localStorage.setItem('currentProjectId', newId)
      DOM.listTodos(newId)
    }
    if (projectList.items.length === 1) {
      localStorage.removeItem('currentProjectId')
      const addBtn = document.querySelector('.project-header .add-button') as HTMLButtonElement
      const titleBar = document.querySelector('.project-header h2')
      if (titleBar == null) {
        throw new Error('title bar not found')
      }
      titleBar.textContent = ''
      addBtn.disabled = true
    }
    projectList.removeProject(id)
    DOM.listProjects()
  }
}
