import { type Project } from './classes'
import createButtonElement from './createButtonElement'
import { projectList } from './index'
import listTodos from './listTodos'
import getIdFromEvent from './getIdFromEvent'

export default function listProjects (): void {
  const projectArea = document.querySelector('.projects-subarea')

  if (projectArea == null) {
    console.error('projectArea does not exist')
    return
  }

  projectArea.innerHTML = ''
  projectList.items.forEach(item => {
    projectArea.appendChild(createProjectItem(item))
  })
  attachListeners()
}

function createProjectItem (project: Project): HTMLLIElement {
  const li = document.createElement('li')
  li.classList.add('project')

  const nameBtn = document.createElement('button')
  nameBtn.setAttribute('data-id', String(project.id))
  nameBtn.classList.add('project-name', 'italic')
  nameBtn.innerText = project.title

  const renameBtn = createButtonElement('rename', 'Rename project')
  renameBtn.setAttribute('data-id', String(project.id))
  const delBtn = createButtonElement('delete', 'Delete project')
  delBtn.setAttribute('data-id', String(project.id))

  li.append(nameBtn, renameBtn, delBtn)
  return li
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
  listProjects()

  const titleBar = document.querySelector('.project-header > h2')
  if (id === localStorage.getItem('currentProjectId') && titleBar != null) {
    titleBar.textContent = title
  }

  target.reset()
}

function deleteProject (e: Event): void {
  const target = e.currentTarget as HTMLElement
  const id = target.dataset.id as string
  const currentProjectId = localStorage.getItem('currentProjectId')
  const projectIndex = projectList.getProjectIndexById(id)
  const projectTitle = projectList.getProject(id).title
  const confirmation = confirm(`Are you sure you want to delete ${projectTitle}`)
  if (confirmation) {
    if (id === currentProjectId && projectList.items.length > 1) {
      const newIndex = (projectList.items.length > projectIndex + 1) ? projectIndex + 1 : projectIndex - 1
      const newId = projectList.items[newIndex].id
      localStorage.setItem('currentProjectId', newId)
      listTodos(newId)
    }
    if (projectList.items.length === 1) {
      localStorage.removeItem('currentProjectId')
    }
    projectList.removeProject(id)
    listProjects()
  }
}

function attachListeners (): void {
  const projects = document.querySelectorAll('li.project')
  projects.forEach(project => {
    const nameBtn = project.querySelector('.project-name')
    const renameBtn = project.querySelector('.rename-button')
    const deleteBtn = project.querySelector('.delete-button')

    nameBtn?.addEventListener('click', e => {
      listTodos(getIdFromEvent(e))
    })

    renameBtn?.addEventListener('click', e => {
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
    })

    deleteBtn?.addEventListener('click', deleteProject)
  })
}
