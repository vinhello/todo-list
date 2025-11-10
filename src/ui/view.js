// DOM rendering only; no app logic
// Use formatDue from utils/date.js if imported
import { formatDue } from "../utils/date.js";
import {
  getProjects,
  getSelectedProject,
  getTodosForProject,
} from "../app/selectors.js";

export function renderApp(containerEl, snapshot) {
  //Clear container (remove all existing content)
  containerEl.innerHTML = "";

  // Create layout structure
  // Sidebar div (for projects list)
  const sidebarEl = document.createElement("div");
  sidebarEl.className = "sidebar";

  // Main div (for todo list)
  const mainEl = document.createElement("div");
  mainEl.className = "main";

  // Detail panel div (for todo editor - can be empty initially)
  const detailPanel = document.createElement("div");
  detailPanel.className = "detail-panel";

  // Append to parent
  containerEl.append(sidebarEl);
  containerEl.append(mainEl);
  containerEl.append(detailPanel);

  // Call render functions:
  // Render projects sidebar (using selector for computed counts)
  const projectsWithCounts = getProjects(snapshot);
  renderProjectList(sidebarEl, projectsWithCounts, snapshot.selectedProjectId);

  // Get selected project using selector
  const selected = getSelectedProject(snapshot);
  if (selected && snapshot.selectedProjectId) {
    // Get todos for selected project (sorted by due date/priority)
    const todos = getTodosForProject(snapshot, snapshot.selectedProjectId);
    if (todos.length > 0) {
      // Render todos
      renderTodoList(mainEl, todos);
    } else {
      // Empty state: no todos in selected project
      mainEl.textContent = "No todos in this project";
    }
  } else {
    // Empty state: no project selected
    mainEl.textContent = "Select a project or add todos";
  }

  // Render todo detail panel
  detailPanel.textContent = "Select a todo to edit";
}

// Sidebar (Projects)
export function renderProjectList(parentEl, projects, selectedProjectId) {
  // CODE: build list; data-ids on buttons for select/rename/delete

  // Clear parent element
  parentEl.innerHTML = "";

  // Handle empty state
  if (!projects || projects.length < 1) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No projects.";
    emptyMsg.className = "empty-message";
    parentEl.appendChild(emptyMsg);
    return;
  }

  // Create Sidebar heading
  const heading = document.createElement("h1");
  heading.textContent = "Projects";
  parentEl.appendChild(heading);

  // Create List container
  const list = document.createElement("ul");
  list.className = "project-list";

  // Loop through projects
  projects.forEach((project) => {
    // Create list item/container for each project
    const item = document.createElement("li");
    item.className = "project-item";

    // Add "selected" class if this is the selected project
    if (project.id === selectedProjectId) {
      item.classList.add("selected");
    }

    // Create project name (clickable to select)
    const nameEl = document.createElement("span");
    nameEl.textContent = project.name;
    nameEl.className = "project-name";
    nameEl.setAttribute("data-project-id", project.id);
    nameEl.setAttribute("data-action", "select-project");

    // Create buttons for rename and delete
    const renameBtn = document.createElement("button");
    renameBtn.textContent = "Rename";
    renameBtn.setAttribute("data-project-id", project.id);
    renameBtn.setAttribute("data-action", "rename-project");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-project-id", project.id);
    deleteBtn.setAttribute("data-action", "delete-project");

    // Append elements
    item.appendChild(nameEl);
    item.appendChild(renameBtn);
    item.appendChild(deleteBtn);
    list.appendChild(item);
  });

  // Apend list to parent
  parentEl.appendChild(list);

  // Create "Add Project" button (always show)
  const addProjectBtn = document.createElement("button");
  addProjectBtn.textContent = "+ Add Project";
  addProjectBtn.className = "add-project-btn";
  addProjectBtn.setAttribute("data-action", "add-project");
  parentEl.appendChild(addProjectBtn);
}

// Main list (compact cards: title + due date + priority color)
export function renderTodoList(parentEl, todos) {
  // CODE: for each todo create row/card elements

  // Clear parent element
  parentEl.innerHTML = "";

  // Handle empty state (if todos array is empty)
  if (!todos || todos.length < 1) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No todos.";
    emptyMsg.className = "empty-message";
    parentEl.appendChild(emptyMsg);
    return;
  }

  // Add Todos heading
  const todoHeader = document.createElement("h1");
  todoHeader.textContent = "Todos";
  parentEl.appendChild(todoHeader);

  // Create list container
  const list = document.createElement("ul");

  // Loop through todos
  todos.forEach((todo) => {
    // Create item element for each todo
    const item = document.createElement("li");
    item.className = "todo-item";

    // Add data-todo-id attribute for event handling
    item.setAttribute("data-todo-id", todo.id);

    // Display todo title
    const title = document.createElement("span");
    title.textContent = todo.title;
    title.className = "todo-name";
    item.appendChild(title);

    // Display due date (if exists) - use formatDue helper if available
    if (todo.dueDate) {
      const dueSpan = document.createElement("span");
      dueSpan.className = "todo-due";
      dueSpan.textContent = formatDue(todo.dueDate);
      item.appendChild(dueSpan);
    }

    // Display priority badge (use applyPriorityBadge helper)
    const priorityBadge = document.createElement("span");
    priorityBadge.className = "todo-priority-badge";
    applyPriorityBadge(priorityBadge, todo.priority);
    item.appendChild(priorityBadge);

    // Show completion status as a checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-completed-checkbox";
    checkbox.checked = !!todo.completed;
    checkbox.setAttribute("data-todo-id", todo.id);
    checkbox.setAttribute("data-action", "toggle-complete");
    item.appendChild(checkbox);

    // Add data-action attribute for selecting this todo
    item.setAttribute("data-action", "select-todo");

    // Optionally, add delete button with data-action
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-delete-btn";
    deleteBtn.textContent = "✗";
    deleteBtn.setAttribute("data-todo-id", todo.id);
    deleteBtn.setAttribute("data-action", "delete-todo");
    item.appendChild(deleteBtn);

    // Append item to list
    list.appendChild(item);
  });

  // Append list to parent
  parentEl.appendChild(list);

  // Create "Add Todo" button (always show)
  const addTodoBtn = document.createElement("button");
  addTodoBtn.textContent = "+ Add Todo";
  addTodoBtn.className = "add-todo-btn";
  addTodoBtn.setAttribute("data-action", "add-todo");
  parentEl.appendChild(addTodoBtn);
}

// Detail panel (expanded editor)
export function renderTodoDetail(parentEl, todo) {
  // Clear parent element
  parentEl.textContent = "";

  // Handle null/undefined todo (show placeholder or empty state)
  if (!todo) {
    parentEl.textContent = "No todo selected.";
    return;
  }

  // Create form or container for editable fields
  const form = document.createElement("form");

  // Title input/display (editable)
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = todo.title || "";
  titleInput.setAttribute("data-todo-id", todo.id);
  titleInput.setAttribute("data-action", "update-title");
  titleInput.placeholder = "Title";

  // Description textarea (editable)
  const description = document.createElement("textarea");
  description.value = todo.description || "";
  description.setAttribute("data-todo-id", todo.id);
  description.setAttribute("data-action", "update-description");
  description.placeholder = "Description";

  // Due date input (editable)
  const dueDateInput = document.createElement("input");
  dueDateInput.type = "date";
  // ISO format 'yyyy-mm-dd' -> input value. todo.dueDate might be null/empty.
  // Safely convert date: check if valid before calling toISOString
  if (todo.dueDate) {
    const date = new Date(todo.dueDate);
    // Check if date is valid (not Invalid Date)
    if (!isNaN(date.getTime())) {
      // Date input expects YYYY-MM-DD format
      dueDateInput.value = date.toISOString().slice(0, 10);
    } else {
      // If dueDate is already in YYYY-MM-DD format, use it directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(todo.dueDate)) {
        dueDateInput.value = todo.dueDate;
      } else {
        dueDateInput.value = "";
      }
    }
  } else {
    dueDateInput.value = "";
  }
  dueDateInput.setAttribute("data-todo-id", todo.id);
  dueDateInput.setAttribute("data-action", "update-due-date");

  // Priority selector (editable)
  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("data-todo-id", todo.id);
  prioritySelect.setAttribute("data-action", "update-priority");
  const priorities = [
    { val: "low", label: "Low" },
    { val: "med", label: "Med" },
    { val: "high", label: "High" },
  ];
  priorities.forEach(({ val, label }) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    if (todo.priority === val) opt.selected = true;
    prioritySelect.appendChild(opt);
  });

  // Notes textarea (editable)
  const notes = document.createElement("textarea");
  notes.value = todo.notes || "";
  notes.setAttribute("data-todo-id", todo.id);
  notes.setAttribute("data-action", "update-notes");
  notes.placeholder = "Notes";

  // Completion checkbox (editable)
  const completedLabel = document.createElement("label");
  completedLabel.textContent = "Completed";
  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.checked = !!todo.completed;
  completedCheckbox.setAttribute("data-todo-id", todo.id);
  completedCheckbox.setAttribute("data-action", "toggle-complete");
  completedLabel.appendChild(completedCheckbox);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "todo-detail-delete-btn";
  deleteBtn.setAttribute("data-todo-id", todo.id);
  deleteBtn.setAttribute("data-action", "delete-todo");

  // Append all elements to form
  form.appendChild(titleInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(description);
  form.appendChild(document.createElement("br"));
  form.appendChild(dueDateInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(prioritySelect);
  form.appendChild(document.createElement("br"));
  form.appendChild(notes);
  form.appendChild(document.createElement("br"));
  form.appendChild(completedLabel);
  form.appendChild(document.createElement("br"));
  form.appendChild(deleteBtn);

  // Append form to parent
  parentEl.appendChild(form);
}

// UI helpers: apply priority colors, empty states, etc.
export function applyPriorityBadge(el, priority) {
  // Remove any existing priority-* classes
  el.classList.remove("priority-low", "priority-med", "priority-high");

  // Add class based on current priority
  if (priority === "low") {
    el.classList.add("priority-low");
    el.textContent = "Low";
  } else if (priority === "med") {
    el.classList.add("priority-med");
    el.textContent = "Med";
  } else if (priority === "high") {
    el.classList.add("priority-high");
    el.textContent = "High";
  } else {
    el.textContent = ""; // fallback if unknown
  }
}
