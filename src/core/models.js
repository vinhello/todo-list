// Data models for Todo and Project objects

// Todo Class
export class Todo {
  constructor({
    id,
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
    completed,
    createdAt,
    updatedAt,
  }) {
    // CODE: assign fields (validate minimally)
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = completed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toggleComplete() {
    // CODE: flip this.complted and update updatedAt
  }

  setTitle(newTitle) {
    // CODE: guard empty strings; set updatedAt
  }

  setDescription(newDesc) {
    // CODE
  }

  setDueDate(newISODateOrNull) {
    // CODE
  }

  setPriority(newPriority) {
    // CODE: newPriority argument above can be "low" | "med" | "high"
  }

  setNotes(newNotes) {
    // CODE
  }

  addChecklistItem(label) {
    // CODE: push {id, label, done:false}; update updatedAt
  }

  toggleChecklistItem(itemId) {
    // CODE
  }

  removeChecklistItem(itemId) {
    // CODE
  }

  toJSON() {
    // CODE: return plain object without methods for storage
  }

  static fromJSON() {
    // CODE: return new Todo(obj) - rehydrate instance from plain text
  }
}

// Project Factory Function
export function createProject({ id, name, todos = [], createdAt }) {
  // CODE: return a plain object with the shape above. ensure todos are Todo instances
}

// Helpers
export function generateId(prefix = "id") {
  // CODE: return `${prefix}_${timestamp}_${random}`
}
