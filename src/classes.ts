import {
  type TodoObject,
  type checklistItem,
  type ProjectObject
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
  done: boolean

  constructor ({
    title,
    description,
    dueDate,
    dateStarted,
    priority,
    notes = '',
    checklist = [],
    id,
    done
  }: TodoObject) {
    this.title = title
    this.description = description
    this.dueDate = dueDate
    this.dateStarted = dateStarted
    this.priority = priority
    this.notes = notes
    this.checklist = checklist
    this.id = id
    this.done = done
  }

  addChecklistItem (itemText: string): void {
    const index = this.checklist.length
    const item = { index, text: itemText, completed: false }
    this.checklist.push(item)
  }
}

export class Project implements ProjectObject {
  title: string
  id: number
  items: TodoItem[]

  constructor (name: string, id: number) {
    this.title = name
    this.id = id
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
  readonly items: Project[] = []

  fromJSON (json: string): void {
    const imports: ProjectList = JSON.parse(json)
    imports.items.forEach(prImport => {
      const project = new Project(prImport.title, prImport.id)
      prImport.items.forEach(item => { project.addItem(new TodoItem(item)) })
      this.addProject(project)
    })
  }

  addProject (project: Project): void {
    this.items.push(project)
  }

  removeProject (id: number): void {
    const item = this.items.filter(item => item.id !== id)
    if (item.length > 1) {
      throw new Error(`The following todo items have the same id: ${toString(item)}`)
    }
    const index = this.items.indexOf(item[0])
    this.items.splice(index, 1)
  }
}
