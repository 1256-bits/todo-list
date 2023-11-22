interface TodoObject {
  title: string;
  description: string;
  dueDate: Date | null;
  dateStarted: Date;
  priority: "low" | "normal" | "high";
  notes: string[];
  checklist: checklistItem[];
}

interface checklistItem {
  test: string;
  completed: boolean;
}

class TodoItem implements TodoObject {
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
}

class Project {
  items: TodoItem[];
  constructor() {
    this.items = [];
  }
}
