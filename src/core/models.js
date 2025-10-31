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
    completed,
    createdAt,
    updatedAt,
  }) {
    // Assign fields (validate minimally)
    this.id = id ? id : generateId("todo");
    if (!title || title.trim() === "") throw new Error("Title is required");
    this.title = title;
    this.description = description ? description : "";
    this.dueDate = dueDate ? dueDate : null;
    this.priority = priority ? priority : "low";
    this.notes = notes ? notes : "";
    this.completed = completed ? completed : false;
    this.createdAt = createdAt ? createdAt : new Date().toISOString();
    this.updatedAt = updatedAt ? updatedAt : new Date().toISOString();
  }

  toggleComplete() {
    // CODE: flip this.completed and update updatedAt
    this.completed = !this.completed;
    this.updatedAt = new Date().toISOString();
  }

  setTitle(newTitle) {
    // CODE: guard empty strings; set updatedAt
    if (newTitle.trim() === "") throw new Error("Title is required");
    this.title = newTitle;
    this.updatedAt = new Date().toISOString();
  }

  setDescription(newDesc) {
    this.description = newDesc;
    this.updatedAt = new Date().toISOString();
  }

  setDueDate(newISODateOrNull) {
    this.dueDate = newISODateOrNull;
    this.updatedAt = new Date().toISOString();
  }

  setPriority(newPriority) {
    // CODE: newPriority argument above can be "low" | "med" | "high"
    this.priority = newPriority;
    this.updatedAt = new Date().toISOString();
  }

  setNotes(newNotes) {
    this.notes = newNotes;
    this.updatedAt = new Date().toISOString();
  }

  // Manual translator that serializes our Todo class data this will be used in store.js to store in localStorage
  // NOTE: When you run JSON.stringify(), the JSON library automatically knows to look for toJSON()
  toJSON() {
    // Return plain object without methods for storage
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      notes: this.notes,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Manual translator that converts the parsed storage data object back into a Todo class object
  static fromJSON(obj) {
    // Rehydrate instance from plain object by running the object data through our Todo class; this turns it back into a class object
    if (!obj || typeof obj !== "object")
      throw new Error("Invalid todo payload");
    return new Todo({
      id: obj.id,
      title: obj.title,
      description: obj.description,
      dueDate: obj.dueDate,
      priority: obj.priority,
      notes: obj.notes,
      completed: Boolean(obj.completed),
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    });
  }
}

// Project Factory Function
export function createProject({ id, name, todos = [], createdAt }) {
  // CODE: return a plain object with the shape above. ensure todos are Todo instances
  if (!name || name.trim() === "") throw new Error("Name is required");
  const normalizedTodos = todos.map((item) =>
    item instanceof Todo ? item : Todo.fromJSON(item)
  );
  return {
    id: id || generateId("proj"),
    name,
    todos: normalizedTodos,
    createdAt: createdAt || new Date().toISOString(),
  };
}

// Helpers to generate a random id for todo_ and proj_
// Using both timestamp and random ints ensures uniqueness
export function generateId(prefix = "id") {
  // Get current time
  let timestamp = Date.now();

  // Get random int between 0-9999
  const min = 0;
  const max = 9999;
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  return `${prefix}_${timestamp}_${random}`;
}
