export default function createIcon (type: 'add' | 'edit' | 'delete'): HTMLElement {
  const href = { add: './svg/add.svg#add', edit: './svg/edit-pencil.svg#edit', delete: './svg/delete.svg#delete' }
  const svg = document.createElement('svg')
  svg.setAttribute('viewBox', '0 0 20 20')

  const use = document.createElement('use')
  use.setAttribute('height', '20')
  use.setAttribute('width', '20')
  use.setAttribute('href', href[type])

  svg.appendChild(use)
  return svg
}
