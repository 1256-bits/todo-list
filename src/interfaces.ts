import { TodoItem } from './classes'

export type priority = 'low' | 'normal' | 'high'

export interface TodoObject {
  title: string
  description: string
  dueDate: Date | null
  dateStarted: Date
  priority: priority
  notes: string
  checklist: checklistItem[]
}

export interface checklistItem {
  text: string
  completed: boolean
}

export interface ProjectObject {
  title: string
  items: TodoItem[]
}

export interface projectImport {
  title: string
  items: TodoObject[]
}
