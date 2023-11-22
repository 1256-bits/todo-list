import {TodoObject, checklistItem, ProjectObject} from "./interfaces"

export class TodoItem implements TodoObject {
  title: string;
  description: string;
  dueDate: Date | null;
  dateStarted: Date;
  priority: "low" | "normal" | "high";
  notes: string[];
  checklist: checklistItem[];

  constructor({
    title,
    description,
    dueDate,
    dateStarted,
    priority,
    notes = [],
    checklist = [],
  }: TodoObject) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.dateStarted = dateStarted;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
  }

  addChecklistItem(itemText: string) {
    const item = { text: itemText, completed: false };
    this.checklist.push(item);
  }
}

export class Project implements ProjectObject {
  name: string;
  items: TodoItem[];

  constructor(name: string) {
    this.name = name;
    this.items = [];
  }
}
