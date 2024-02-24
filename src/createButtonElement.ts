import createIcon from './create-icon'
export default function createButtonElement (type: 'add' | 'rename' | 'delete' | 'close', helpMsg: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.classList.add(`${type}-button`)

  const svg = createIcon(type, helpMsg)
  button.appendChild(svg)

  return button
}
