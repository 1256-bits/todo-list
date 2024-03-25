export default function getIdFromEvent (e: Event): string {
  const target = e.currentTarget
  if (!(target instanceof HTMLElement)) {
    throw new Error('currentTarget not found')
  }
  if (target.dataset.id != null) {
    return target.dataset.id
  }
  const parent = target.parentElement
  if (parent?.dataset.id != null) {
    return parent.dataset.id
  }
  throw new Error('ID not found')
}
