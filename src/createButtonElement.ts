import createIcon from './create-icon'
export default function createButtonElement (type: 'add' | 'rename' | 'delete' | 'close'): HTMLButtonElement {
  const button = document.createElement('button')
  button.classList.add(`${type}-button`)

  const svg = createIcon(type)
  button.appendChild(svg)

  return button
}
