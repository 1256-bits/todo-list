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
}

function deleteProject (): void {
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
      const dialog = document.querySelector('#rename-project') as HTMLDialogElement
      dialog?.showModal()
      const form = document.querySelector('#rename-project-form') as HTMLFormElement
      const id = getIdFromEvent(e)
      form.addEventListener('submit', e => {
        renameProject(e, id)
      })
    })

    deleteBtn?.addEventListener('click', e => {
    })
  })
}
