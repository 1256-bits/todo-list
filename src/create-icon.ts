export default function createIcon (type: 'add' | 'rename' | 'delete'): SVGSVGElement {
  const href = { add: './svg/add.svg#add', rename: './svg/edit-pencil.svg#edit', delete: './svg/delete.svg#delete' }
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 20 20')

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('width', '20')
  use.setAttribute('height', '20')
  use.setAttribute('href', href[type])

  svg.appendChild(use)
  return svg
}
