import {
  type TodoObject,
  type checklistItem,
  type ProjectObject,
  type projectImport
} from './interfaces'

export class TodoItem implements TodoObject {
  title: string
  description: string
  dueDate: Date | null
  dateStarted: Date
  priority: 'low' | 'normal' | 'high'
  notes: string
  checklist: checklistItem[]
  id: number

  constructor ({
    title,
    description,
    dueDate,
    dateStarted,
    priority,
    notes = '',
    checklist = [],
    id
  }: TodoObject) {
    this.title = title
    this.description = description
    this.dueDate = dueDate
    this.dateStarted = dateStarted
    this.priority = priority
    this.notes = notes
    this.checklist = checklist
    this.id = id
  }

  adddChecklistItem (itemText: string): void {
    const item = { text: itemText, completed: false }
    this.checklist.push(item)
  }
}

export class Project implements ProjectObject {
  title: string
  items: TodoItem[]

  constructor (name: string) {
    this.title = name
    this.items = []
  }

  addItem (item: TodoItem): void {
    this.items.push(item)
  }

  removeItem (title: string): void {
    this.items = this.items.filter(item => item.title !== title)
  }
}

export class ProjectList {
  items: Project[] = []

  fromJSON (json: string): void {
    const imports: projectImport[] = JSON.parse(json)
    const projects: Project[] = []
    imports.forEach(prImport => {
      const project = new Project(prImport.title)
      prImport.items.forEach(item => project.items.push(new TodoItem(item)))
      projects.push(project)
    })
  }

  addProject (project: Project): void {
    this.items.push(project)
  }

  removeProject (title: string): void {
    this.items = this.items.filter(item => item.title !== title)
  }
}
