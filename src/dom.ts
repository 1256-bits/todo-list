import listProjects, { deleteProject, renameHandler } from './listProjects'
import listTodos from './listTodos'
import getIdFromEvent from './getIdFromEvent'

export { listTodos, getIdFromEvent, listProjects }

const headerRenameBtn = document.querySelector('.project-header > .rename-button')
const headerDeleteBtn = document.querySelector('.project-header > .delete-button')

headerRenameBtn?.addEventListener('click', renameHandler)
headerDeleteBtn?.addEventListener('click', deleteProject)

export function addChecklistItem (): void {
}

export function renameChecklistItem (): void {
}

export function deleteChecklistItem (): void {
}
