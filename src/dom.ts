import listProjects from './listProjects'
import { deleteProject, renameHandler } from './projectHandlers'
import listTodos from './listTodos'
import { addChecklistItem, deleteChecklistItem, renameChecklistItem } from './checklistHandlers'
import { createTodoHandler, newTodoBtnClickHandler } from './todoHandlers'

export { listTodos, listProjects, addChecklistItem, renameChecklistItem, deleteChecklistItem, createTodoHandler, newTodoBtnClickHandler, renameHandler, deleteProject }

const headerRenameBtn = document.querySelector('.project-header > .rename-button')
const headerDeleteBtn = document.querySelector('.project-header > .delete-button')

headerRenameBtn?.addEventListener('click', renameHandler)
headerDeleteBtn?.addEventListener('click', deleteProject)
