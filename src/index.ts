interface TodoObject {
  title: string;
  description: string;
  dueDate: Date | null;
  dateStarted: Date;
  priority: "low" | "normal" | "high";
  notes: string[];
  checklist: string[];
}

class TodoItem implements TodoObject {
  title: string;
  description: string;
  dueDate: Date | null;
  dateStarted: Date;
  priority: "low" | "normal" | "high";
  notes: string[];
  checklist: string[];
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
}

class Project {
  items: TodoItem[];
  constructor() {
    this.items = [];
  }
}
