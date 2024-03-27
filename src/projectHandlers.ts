import { projectList } from './index'
import createProjectObject from './createProjectObject'
import getIdFromEvent from './getIdFromEvent'
import * as DOM from './dom'
import { Project } from './classes'
import getCurrentProjectId from './getCurrentProjectId'

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
  projectList.save()
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
      const todoArea = document.querySelector('main > ul')
      const titleBar = document.querySelector('.project-header h2')
      if (titleBar == null) {
        throw new Error('title bar not found')
      }
      titleBar.textContent = ''
      addBtn.disabled = true
      if (todoArea != null) {
        const children = Array.from(todoArea.children).filter(child => !child.classList.contains('no-todos'))
        children.forEach(child => {
          todoArea?.removeChild(child)
        })
      }
    }
    projectList.removeProject(id)
    projectList.save()
    DOM.listProjects()
  }
}

export function newProjectHandler (e: Event): void {
  const targetForm = e.target as HTMLFormElement
  const formData = new FormData(targetForm)
  const { title, id } = createProjectObject(formData)
  const project = new Project(title, id)
  localStorage.setItem('currentProjectId', id)

  if (projectList.items.length === 0) {
    const addBtn = document.querySelector('.project-header .add-button') as HTMLButtonElement
    addBtn.disabled = false
  }

  projectList.addProject(project)
  projectList.save()
  targetForm.reset()
  DOM.listProjects()
  DOM.listTodos(getCurrentProjectId())
}
