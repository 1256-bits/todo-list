export default function getIdFromEvent (e: Event): string {
  if (!(e.currentTarget instanceof HTMLElement) || e.currentTarget.dataset.id == null) {
    throw new Error('Not an HTML element or missing ID')
  }
  const id = e.currentTarget.dataset.id
  return id
}
