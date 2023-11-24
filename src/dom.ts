import { ProjectList } from './classes'

  export function removeProject (eventTarget: HTMLButtonElement, projectList: ProjectList): void {
    if (eventTarget.dataset.id === '' || eventTarget.dataset.id == null) {
      console.error('Invalid ID')
      return
    }
    const id = parseInt(eventTarget.dataset.id)
    projectList.removeProject(id)
    listProjects(projectList)
  }

  export function listProjects (projectList: ProjectList): void {
    const list = document.querySelector('#project-list')
    list?.removeChild(list?.lastElementChild as HTMLDivElement)
    const plWrapper = document.createElement('div')
    projectList.items.forEach(project => {
      const div = document.createElement('div')
      div.innerText = project.title

      const del = document.createElement('button')
      del.innerText = '[x]'
      del.dataset.id = String(project.id)
      del.addEventListener('click', e => {
        removeProject(e.target as HTMLButtonElement, projectList)
      })
      div.appendChild(del)
      plWrapper.appendChild(div)
    })
    list?.appendChild(plWrapper)
 }
