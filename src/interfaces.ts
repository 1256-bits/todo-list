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
  id: number
}

export interface checklistItem {
  index: number
  text: string
  completed: boolean
}

export interface ProjectObject {
  title: string
  id: number
  items: TodoItem[]
}
