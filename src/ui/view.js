// DOM rendering only; no app logic

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
  // Render projects sidebar
  renderProjectList(sidebarEl, snapshot.projects, snapshot.selectedProjectId);

  // Get selected project
  const selected = snapshot.projects.find(
    (p) => p.id === snapshot.selectedProjectId
  );
  if (selected && selected.todos) {
    // Render todos
    renderTodoList(mainEl, selected.todos);
  } else {
    // Empty state: no project selected or no todos
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
    parentEl.textContent = "No projects.";
    return;
  }

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
}

// Main list (compact cards: title + due date + priority color)
export function renderTodoList(parentEl, todos) {
  // CODE: for each todo create row/card elements

  // Clear parent element
  // Handle empty state (if todos array is empty)
  // Create list container (ul or div)

  // Loop through todos
  todos.forEach((todo) => {});
  // Create card/item element for each todo
  // Add data-todo-id attribute for event handling
  // Display todo title
  // Display due date (if exists) - use formatDue helper if available
  // Display priority badge (use applyPriorityBadge helper)
  // Show completion status (checkbox or visual indicator)
  // Add data-action attribute (e.g., "select-todo", "toggle-complete", "delete-todo")
  // Append elements
  // Append list to parent
}

// Detail panel (expanded editor)
export function renderTodoDetail(parentEl, todo) {
  // CODE: editable fields for a single todo
  // Clear parent element
  // Handle null/undefined todo (show placeholder or empty state)
  // Create form or container for editable fields
  // Title input/display (editable)
  // Create input element
  // Set value to todo.title
  // Add data-todo-id and data-action="update-title"
  // Description textarea (editable)
  // Create textarea element
  // Set value to todo.description
  // Add data-todo-id and data-action="update-description"
  // Due date input (editable)
  // Create date input element
  // Set value to todo.dueDate (convert ISO to date input format if needed)
  // Add data-todo-id and data-action="update-due-date"
  // Priority selector (editable)
  // Create select dropdown or buttons
  // Options: "low", "med", "high"
  // Set selected value to todo.priority
  // Add data-todo-id and data-action="update-priority"
  // Notes textarea (editable)
  // Create textarea element
  // Set value to todo.notes
  // Add data-todo-id and data-action="update-notes"
  // Completion checkbox (editable)
  // Create checkbox input
  // Set checked to todo.completed
  // Add data-todo-id and data-action="toggle-complete"
  // Delete button
  // Create delete button
  // Add data-todo-id and data-action="delete-todo"
  // Append all elements to parent
}

// UI helpers: apply priority colors, empty states, etc.
export function applyPriorityBadge(el, priority) {
  // Remove any existing priority classes (low, med, high)
  // Add priority class based on value
  // If priority === "low" -> add class "priority-low"
  // If priority === "med" -> add class "priority-med"
  // If priority === "high" -> add class "priority-high"
  // Optionally set text content or background color
  // Optionally add visual indicator (icon, badge text, etc.)
}
