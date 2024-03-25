import createIcon from './create-icon'
import { type buttonTypes } from './interfaces'

export default function createButtonElement (type: buttonTypes, helpMsg: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.classList.add(`${type}-button`)

  const svg = createIcon(type, helpMsg)
  button.appendChild(svg)

  return button
}
