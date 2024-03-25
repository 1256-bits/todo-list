import listProjects, { deleteProject, renameHandler } from './listProjects'
import listTodos from './listTodos'
import getIdFromEvent from './getIdFromEvent'
import { addChecklistItem, deleteChecklistItem, renameChecklistItem } from './checklistHandlers'
import { createTodoHandler, newTodoBtnClickHandler } from './todoHandlers'

export { listTodos, getIdFromEvent, listProjects, addChecklistItem, renameChecklistItem, deleteChecklistItem, createTodoHandler, newTodoBtnClickHandler }

const headerRenameBtn = document.querySelector('.project-header > .rename-button')
const headerDeleteBtn = document.querySelector('.project-header > .delete-button')

headerRenameBtn?.addEventListener('click', renameHandler)
headerDeleteBtn?.addEventListener('click', deleteProject)
