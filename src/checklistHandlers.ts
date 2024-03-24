import { getCurrentProjectId, projectList } from '.'
import { listTodos } from './dom'

export function addChecklistItem (e: Event): void {
  const newChecklistDialog = document.querySelector('#new-checklist') as HTMLDialogElement
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  const callback = (e: Event): void => {
    if (id == null) {
      return
    }
    addChecklistHandler(e, id)
  }
  newChecklistDialog.showModal()
  newChecklistDialog.addEventListener('submit', callback, { once: true })
  newChecklistDialog.addEventListener('close', e => {
    e.currentTarget?.removeEventListener('submit', callback)
  })
}

export function renameChecklistItem (e: Event): void {
  const editChecklistDialog = document.querySelector('#edit-checklist') as HTMLDialogElement
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  const index = target.parentElement?.dataset.index
  const callback = (e: Event): void => {
    if (id == null || index == null) {
      return
    }
    editChecklistHandler(e, id, parseInt(index))
  }

  const input = editChecklistDialog.querySelector('input')
  const title = target.parentElement?.querySelector('label')?.textContent
  if (input != null && title != null) {
    input.value = title
  }
  input?.addEventListener('focus', () => {
    input.selectionStart = input.selectionEnd = input.value.length
  })

  editChecklistDialog.showModal()
  editChecklistDialog.addEventListener('submit', callback, { once: true })
  editChecklistDialog.addEventListener('close', e => {
    e.currentTarget?.removeEventListener('submit', callback)
  })
}

export function deleteChecklistItem (e: Event): void {
  const target = e.currentTarget as HTMLElement
  const id = target.parentElement?.dataset.id
  const index = target.parentElement?.dataset.index
  const projectId = getCurrentProjectId()
  const conf = confirm('Are you sure?')
  if (conf && typeof index === 'string' && typeof id === 'string') {
    const todo = projectList.getProject(projectId).getItem(id)
    todo.removeChecklistItem(parseInt(index))
    listTodos(projectId)
    return
  }
  console.error('Something went wrong')
}

function addChecklistHandler (e: Event, id: string): void {
  const target = e.target as HTMLFormElement
  const formData = new FormData(target)
  const content = formData.get('content') as string
  if (content == null) {
    return
  }
  const projectId = getCurrentProjectId()
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
  const projectId = getCurrentProjectId()
  const todo = projectList.getProject(projectId).getItem(id)
  const item = todo.findChecklistItem(index)
  item.text = content
  listTodos(projectId)
  target.reset()
}
