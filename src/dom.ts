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
    checklistHandler(e, id, 'add')
  }, { once: true })
}

export function renameChecklistItem (e: Event): void {
  const editChecklistDialog = document.querySelector('#edit-checklist') as HTMLDialogElement
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  const index = target.parentElement?.dataset.index as string
  editChecklistDialog.showModal()
  editChecklistDialog.addEventListener('submit', e => {
    if (id == null) {
      return
    }
    checklistHandler(e, id, 'edit', parseInt(index))
  }, { once: true })
}

export function deleteChecklistItem (): void {
}

function checklistHandler (e: Event, id: string, type: 'add'): void
function checklistHandler (e: Event, id: string, type: 'edit', index: number): void
function checklistHandler (e: Event, id: string, type: 'add' | 'edit', index?: number): void {
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
  if (type === 'add') {
    todo.addChecklistItem(content)
  } else if (index != null) {
    const item = todo.findChecklistItem(index)
    item.text = content
  }
  listTodos(projectId)
}
