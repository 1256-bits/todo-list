import { projectList } from './index'
import * as DOM from './dom'

export function exportHandler (): void {
  const json = localStorage.getItem('projectList') ?? ''
  const blob = new Blob([json], { type: 'JSON text data' })
  const link = document.createElement('a')
  link.setAttribute('href', URL.createObjectURL(blob))
  link.setAttribute('download', 'export.json')
  link.click()
}

export function importHandler (): void {
  const dialog = document.querySelector('#upload') as HTMLDialogElement
  const form = dialog.querySelector('form')
  dialog?.showModal()
  form?.addEventListener('submit', formSubmitHandler, { once: true })
}

function formSubmitHandler (e: Event): void {
  const target = e.target as HTMLFormElement
  const formData = new FormData(target)
  const file = formData.get('import-file')
  if (file instanceof File) {
    file.text().then(text => {
      projectList.fromJSON(text)
      const id = projectList.items[0].id
      DOM.listTodos(id)
      DOM.listProjects()
      if (projectList.items[0].items.length > 0) {
        const addBtn = document.querySelector('.project-header .add-button')
        if (!(addBtn instanceof HTMLButtonElement)) {
          throw new Error('Add button not found')
        }
        addBtn.disabled = false
      }
    }).catch(() => {
      console.error('Unable to upload a file')
    })
  }
}
