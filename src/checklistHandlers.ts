import { projectList } from '.'
import { listTodos } from './dom'

export function addChecklistItem (e: Event): void {
  const newChecklistDialog = document.querySelector('#new-checklist') as HTMLDialogElement
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  newChecklistDialog.showModal()
  newChecklistDialog.addEventListener('submit', e => {
    if (id == null) {
      return
    }
    addChecklistHandler(e, id)
  }, { once: true })
}

export function renameChecklistItem (e: Event): void {
  const editChecklistDialog = document.querySelector('#edit-checklist') as HTMLDialogElement
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  const index = target.parentElement?.dataset.index
  editChecklistDialog.showModal()
  editChecklistDialog.addEventListener('submit', e => {
    if (id == null || index == null) {
      return
    }
    editChecklistHandler(e, id, parseInt(index))
  }, { once: true })
}

export function deleteChecklistItem (): void {
}

function addChecklistHandler (e: Event, id: string): void {
  const target = e.target as HTMLFormElement
  const formData = new FormData(target)
  const content = formData.get('content') as string
  if (content == null) {
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
  target.reset()
}

function editChecklistHandler (e: Event, id: string, index: number): void {
  const target = e.target as HTMLFormElement
  const formData = new FormData(target)
  const content = formData.get('content') as string
  if (content == null) {
    return
  }
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId == null) {
    console.error('Current project ID not found')
    return
  }
  const todo = projectList.getProject(projectId).getItem(id)
  const item = todo.findChecklistItem(index)
  item.text = content
  listTodos(projectId)
  target.reset()
}
