import { projectList } from './index'

export function exportHandler (): void {
  const json = localStorage.getItem('projectList') ?? ''
  const blob = new Blob([json], {type: 'JSON text data'})
  const link = document.createElement('a')
  link.setAttribute('href', URL.createObjectURL(blob))
  link.setAttribute('download', 'export.json')
  link.click()
}
