export default function getIdFromEvent (e: Event): string {
  if (!(e.target instanceof HTMLElement) || e.target.parentElement?.dataset.id == null) {
    throw new Error('listTodos: not an HTML element or missing ID')
  }
  const id = e.target.parentElement?.dataset.id
  return id
}
