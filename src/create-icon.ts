export default function createIcon (type: 'add' | 'rename' | 'delete' | 'close', helpMsg: string): SVGSVGElement {
  const href = { add: './svg/add.svg#add', rename: './svg/edit-pencil.svg#edit', delete: './svg/delete.svg#delete', close: './svg/close.svg#close' }
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 20 20')

  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
  title.textContent = helpMsg

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('width', '20')
  use.setAttribute('height', '20')
  use.setAttribute('href', href[type])

  svg.append(title, use)
  return svg
}
