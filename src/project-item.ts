import { type Project } from './classes'
import createIcon from './create-icon'

export default function createProjectItem (project: Project): HTMLLIElement {
  const li = document.createElement('li')
  li.classList.add('project')

  const nameBtn = document.createElement('button')
  nameBtn.classList.add('project-name', 'italic')
  nameBtn.innerText = project.title
  nameBtn.setAttribute('data-id', String(project.id))

  const editBtn = createEditButton()
  const delBtn = createDeleteButton()

  li.append(nameBtn, editBtn, delBtn)
  return li
}

function createEditButton (): HTMLButtonElement {
  const button = document.createElement('button')
  button.classList.add('rename-button')

  const svg = createIcon('edit')
  button.appendChild(svg)

  return button
}

function createDeleteButton (): HTMLButtonElement {
  const button = document.createElement('button')
  button.classList.add('delete-button')

  const svg = createIcon('delete')
  button.appendChild(svg)

  return button
}
