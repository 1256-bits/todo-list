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
  readonly checklist: checklistItem[]
  readonly id: number | string
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

  checkTodo (): void {
    this.done = true
  }

  uncheckTodo (): void {
    this.done = false
  }

  addChecklistItem (itemText: string): void {
    const index = this.checklist.length
    const item = { index, text: itemText, completed: false }
    this.checklist.push(item)
  }

  checklistCheckItem (index: number): void {
    const checklistFiltered = this.checklist.filter(item => item.index === index)
    if (checklistFiltered.length > 1) {
      throw new Error(`${this.title}: 2 or more checklist items appear to have the same index (${index})`)
    }
    const item = checklistFiltered[0]
    item.completed = true
  }

  checklistUncheckItem (index: number): void {
    const checklistFiltered = this.checklist.filter(item => item.index === index)
    if (checklistFiltered.length > 1) {
      throw new Error(`${this.title}: 2 or more checklist items appear to have the same index (${index})`)
    }
    const item = checklistFiltered[0]
    item.completed = false
  }
}

export class Project implements ProjectObject {
  readonly title: string
  readonly id: number | string
  readonly items: TodoItem[]

  constructor (name: string, id: number | string) {
    this.title = name
    this.id = id
    this.items = []
  }

  addItem (item: TodoItem): void {
    this.items.push(item)
  }

  removeItem (id: number | string): void {
    const item = this.items.filter(item => item.id !== id)
    if (item.length > 1) {
      throw new Error(`${item.length} todo items have the same id`)
    }
    const index = this.items.indexOf(item[0])
    this.items.splice(index, 1)
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

  removeProject (id: number | string): void {
    const item = this.items.filter(item => item.id !== id)
    if (item.length > 1) {
      throw new Error(`${item.length} projects have the same id`)
    }
    const index = this.items.indexOf(item[0])
    this.items.splice(index, 1)
  }
}
