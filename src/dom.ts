import listProjects, { deleteProject, renameHandler } from './listProjects'
import listTodos from './listTodos'
import getIdFromEvent from './getIdFromEvent'
import { projectList } from '.'

export { listTodos, getIdFromEvent, listProjects }

const headerRenameBtn = document.querySelector('.project-header > .rename-button')
const headerDeleteBtn = document.querySelector('.project-header > .delete-button')

headerRenameBtn?.addEventListener('click', renameHandler)
headerDeleteBtn?.addEventListener('click', deleteProject)

export function addChecklistItem (e: Event): void {
  const newChecklistDialog = document.querySelector('#new-checklist') as HTMLDialogElement
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  newChecklistDialog.showModal()
  newChecklistDialog.addEventListener('submit', e => {
    if (id == null) {
      return
    }
    newChecklistHandler(e, id)
  }, { once: true })
}

export function renameChecklistItem (): void {
}

export function deleteChecklistItem (): void {
}

function newChecklistHandler (e: Event, id: string): void {
  const target = e.target as HTMLFormElement
  const formData = new FormData(target)
  const content = formData.get('content') as string
  if (content == null) {
    target.reset()
    return
  }
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId == null) {
    console.error('Current project ID not found')
    return
  }
  const todo = projectList.getProject(projectId).getItem(id)
  todo.addChecklistItem(content)
  listTodos(projectId)
}
