// DOM rendering only; no app logic

// Root render
export function renderApp(containerEl, snapshot) {
  // CODE: clear container, render sidebar (projects), main (todo list), detail panel placeholder
}

// Sidebar (Projects)
export function renderProjectList(parentEl, projects, selectedProjectId) {
  // CODE: build list; data-ids on buttons for select/rename/delete
}

// Main list (compact cards: title + due date + priority color)
export function renderTodoList(parentEl, todos) {
  // CODE: for each todo create row/card elements
}

// Detail panel (expanded editor)
export function renderTodoDetail(parentEl, todo) {
  // CODE: editable fields for a single todo
}

// UI helpers: apply priority colors, empty states, etc.
export function applyPriorityBadge(el, priority) {
  // CODE
}
