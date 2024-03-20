import { type Project } from './classes'
import createButtonElement from './createButtonElement'
import { projectList } from './index'
import listTodos, { getIdFromEvent } from './listTodos'

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
  li.setAttribute('data-id', String(project.id))

  const nameBtn = document.createElement('button')
  nameBtn.classList.add('project-name', 'italic')
  nameBtn.innerText = project.title

  const renameBtn = createButtonElement('rename', 'Rename project')
  const delBtn = createButtonElement('delete', 'Delete project')

  li.append(nameBtn, renameBtn, delBtn)
  return li
}

function attachListeners (): void {
  const projectNameBtns = document.querySelectorAll('.project-name')
  projectNameBtns.forEach(name => {
    name.addEventListener('click', e => {
      listTodos(getIdFromEvent(e))
    })
  })
}
