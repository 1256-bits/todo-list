export interface TodoObject {
  title: string
  description: string
  dueDate: Date | null
  dateStarted: Date
  priority: 'low' | 'normal' | 'high'
  notes: string
  checklist: checklistItem[]
}

export interface checklistItem {
  text: string
  completed: boolean
}

export interface ProjectObject {
  title: string
  items: TodoObject[]
}

export interface projectImport {
  title: string
  items: TodoObject[]
}
