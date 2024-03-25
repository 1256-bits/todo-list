export default function getCurrentProjectId (): string {
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId == null) {
    throw new Error('Missing current project ID')
  }
  return projectId
}
