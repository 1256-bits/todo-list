import { Project } from './classes'
export default function createProjectItem (project: Project): HTMLLIElement {
  const li = document.createElement('li')
  li.classList.add('project')

  const nameBtn = document.createElement('button')
  nameBtn.classList.add('project-name', 'italic')


  const renameBtn = document.createElement('button')
  renameBtn.classList.add('rename-button')

  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete-button')

  return li
}
