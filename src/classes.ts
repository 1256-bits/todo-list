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
  readonly id: string
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
    this.dateStarted = dateStarted ?? new Date()
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

  updateFields (data: TodoObject): void {
    this.title = data.title
    this.description = data.description
    this.dueDate = data.dueDate
    this.dateStarted = data.dateStarted ?? this.dateStarted
    this.priority = data.priority
    this.notes = data.notes
  }

  updataNotes (newNotes: string): void {
    this.notes = newNotes
  }

  addChecklistItem (itemText: string): void {
    const itemCount = this.checklist.length
    const index = (itemCount === 0) ? 0 : this.checklist[itemCount - 1].index + 1
    const item = { index, text: itemText, completed: false }
    this.checklist.push(item)
  }

  removeChecklistItem (index: number): void {
    const item = this.findChecklistItem(index)
    const trueIndex = this.checklist.indexOf(item)
    this.checklist.splice(trueIndex, 1)
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

  findChecklistItem (index: number): checklistItem {
    const item = this.checklist.filter(item => item.index === index)
    if (item.length > 1) {
      throw new Error(`${this.title}: 2 or more checklist items appear to have the same index (${index})`)
    }
    return item[0]
  }
}

export class Project implements ProjectObject {
  title: string
  readonly id: string
  readonly items: TodoItem[]

  constructor (name: string, id: string) {
    this.title = name
    this.id = id
    this.items = []
  }

  addItem (item: TodoItem): void {
    this.items.push(item)
    this.sortByPriority()
  }

  removeItem (id: string): void {
    const item = this.items.filter(item => item.id === id)
    if (item.length > 1) {
      throw new Error(`${item.length} todo items have the same id`)
    }
    const index = this.items.indexOf(item[0])
    this.items.splice(index, 1)
  }

  getItem (id: string): TodoItem {
    const item = this.items.filter(item => item.id === id)
    if (item.length > 1) {
      throw new Error('More than 1 items with the same id')
    }
    return item[0]
  }

  private sortByPriority (): void {
    const valueMap = { high: 2, normal: 1, low: 0 }
    this.items.sort((x, y) => valueMap[y.priority] - valueMap[x.priority])
  }
}

export class ProjectList {
  items: Project[] = []

  fromJSON (json: string | null): void {
    if (json == null) {
      console.error('ProjectList: cannot convert null to json')
      return
    }
    const imports: ProjectList = JSON.parse(json)

    const itemCollector: Project[] = []
    try {
      imports.items.forEach(prImport => {
        const project = new Project(prImport.title, prImport.id)
        prImport.items.forEach(item => { project.addItem(new TodoItem(item)) })
        itemCollector.push(project)
      })
    } catch {
      throw new Error('Import failed. Incorrect import file format')
    }
    this.clear()
    localStorage.clear()
    itemCollector.forEach(item => {
      this.addProject(item)
    })
    this.save()
  }

  addProject (project: Project): void {
    this.items.push(project)
  }

  removeProject (id: string): void {
    const index = this.getProjectIndexById(id)
    this.items.splice(index, 1)
  }

  getProject (id: string): Project {
    const item = this.items.filter(item => item.id === id)
    if (item.length > 1) {
      throw new Error(`${item.length} projects have the same id: ${id}`)
    }
    return item[0]
  }

  getProjectIndexById (id: string): number {
    const project = this.getProject(id)
    const index = this.items.indexOf(project)
    return index
  }

  save (): void {
    const json = JSON.stringify(this)
    localStorage.setItem('projectList', json)
  }

  restore (): void {
    const json = localStorage.getItem('projectList')
    if (json == null) {
      console.log('localStorage is empty. Aborting')
      return
    }
    this.fromJSON(json)
  }

  clear (): void {
    this.items = []
  }
}
