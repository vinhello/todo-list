import AppController from "../app/controller.js";
import { renderApp, renderTodoDetail } from "./view.js";

export function attachHandlers(rootEl) {
  // Call initial render
  const snapshot = AppController.getSnapshot();
  renderApp(rootEl, snapshot);

  // ============================================
  // CLICK EVENT HANDLER (Event Delegation)
  // ============================================

  rootEl.addEventListener("click", (e) => {
    const action =
      e.target.getAttribute("data-action") ||
      e.target.closest("[data-action]")?.getAttribute("data-action");

    // ============================================
    // PROJECT ACTIONS
    // ============================================
    if (action === "add-project") {
      const name = prompt("Enter new project name:");
      if (name && name.trim()) {
        AppController.createProjectAndSelect(name.trim());
        const snapshot = AppController.getSnapshot();
        renderApp(rootEl, snapshot);
      }
    }

    if (action === "select-project") {
      const projectId =
        e.target.getAttribute("data-project-id") ||
        e.target.closest("[data-project-id]")?.getAttribute("data-project-id");
      if (projectId) {
        AppController.selectProject(projectId);
        const snapshot = AppController.getSnapshot();
        renderApp(rootEl, snapshot);
      }
    }

    if (action === "rename-project") {
      const projectId =
        e.target.getAttribute("data-project-id") ||
        e.target.closest("[data-project-id]")?.getAttribute("data-project-id");
      if (projectId) {
        const newName = prompt("Enter new name for the project:");
        if (newName && newName.trim()) {
          AppController.renameProject(projectId, newName.trim());
          const snapshot = AppController.getSnapshot();
          renderApp(rootEl, snapshot);
        }
      }
    }

    if (action === "delete-project") {
      const projectId =
        e.target.getAttribute("data-project-id") ||
        e.target.closest("[data-project-id]")?.getAttribute("data-project-id");
      if (projectId) {
        // Get project name for confirmation
        const snapshot = AppController.getSnapshot();
        const project = snapshot.projects.find((p) => p.id === projectId);
        const projectName = project?.name || "this project";
        const confirmDelete = window.confirm(
          `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
        );
        if (!confirmDelete) return;
        AppController.deleteProject(projectId);
        const updatedSnapshot = AppController.getSnapshot();
        renderApp(rootEl, updatedSnapshot);
      }
    }

    // ============================================
    // TODO ACTIONS
    // ============================================

    if (action === "add-todo") {
      // Get selected projectId from snapshot
      const snapshot = AppController.getSnapshot();
      const projectId = snapshot.selectedProjectId;
      if (!projectId) {
        alert("Please select a project first.");
        return;
      }

      // Prompt user for todo fields
      const title = prompt("Todo Title:");
      if (!title || !title.trim()) return;

      const description = prompt("Description (optional):") || "";
      const dueDate = prompt("Due date (YYYY-MM-DD) (optional):") || "";
      let priority = prompt("Priority (low, med, high) (optional):") || "";
      priority = priority.trim().toLowerCase();
      // Normalize priority: "medium" -> "med", validate values
      if (priority === "medium") priority = "med";
      if (priority && !["low", "med", "high"].includes(priority)) {
        priority = "low"; // Default to low if invalid
      }
      const notes = prompt("Notes (optional):") || "";

      AppController.addTodo(projectId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.trim() || null,
        priority: priority || "low",
        notes: notes.trim(),
      });

      const updatedSnapshot = AppController.getSnapshot();
      renderApp(rootEl, updatedSnapshot);
    }

    if (action === "select-todo") {
      const todoId =
        e.target.getAttribute("data-todo-id") ||
        e.target.closest("[data-todo-id]")?.getAttribute("data-todo-id");
      if (todoId) {
        const snapshot = AppController.getSnapshot();
        const projectId = snapshot.selectedProjectId;
        // Find the selected project from the snapshot
        const project = snapshot.projects.find((p) => p.id === projectId);
        // Find the todo within the selected project
        const todo = project?.todos.find((t) => t.id === todoId);
        if (todo) {
          const detailPanel = rootEl.querySelector(".detail-panel");
          renderTodoDetail(detailPanel, todo);
        }
      }
    }

    if (action === "toggle-complete") {
      const todoId =
        e.target.getAttribute("data-todo-id") ||
        e.target.closest("[data-todo-id]")?.getAttribute("data-todo-id");
      if (todoId) {
        const snapshot = AppController.getSnapshot();
        const projectId = snapshot.selectedProjectId;
        // Call the controller to toggle completion state
        AppController.toggleTodoComplete(projectId, todoId);
        // Re-render app with updated state
        const updatedSnapshot = AppController.getSnapshot();
        renderApp(rootEl, updatedSnapshot);
      }
    }

    if (action === "delete-todo") {
      const todoId =
        e.target.getAttribute("data-todo-id") ||
        e.target.closest("[data-todo-id]")?.getAttribute("data-todo-id");
      if (todoId) {
        const snapshot = AppController.getSnapshot();
        const projectId = snapshot.selectedProjectId;
        // Verify user really wants to delete (confirmation dialog)
        const todoTitle = (() => {
          // Try to extract todo title for better confirmation message
          const project = snapshot.projects.find((p) => p.id === projectId);
          const todo = project?.todos.find((t) => t.id === todoId);
          return todo?.title || "this to-do";
        })();
        const confirmDelete = window.confirm(
          `Are you sure you want to delete "${todoTitle}"? This action cannot be undone.`
        );
        if (!confirmDelete) return;
        AppController.deleteTodo(projectId, todoId);
        // Re-render app with updated state
        const updatedSnapshot = AppController.getSnapshot();
        renderApp(rootEl, updatedSnapshot);
      }
    }
  });

  // ============================================
  // CHANGE EVENT HANDLER (For Form Inputs)
  // ============================================
  // Listen for changes on input/textarea/select elements
  // These are in the detail panel (renderTodoDetail)
  // Get todoId and action from data attributes
  // Call controller.updateTodo with the new value

  rootEl.addEventListener("change", (e) => {
    // Check if the changed element has data-action and data-todo-id
    // const action = e.target.getAttribute('data-action');
    // const todoId = e.target.getAttribute('data-todo-id');
    const action = e.target.getAttribute("data-action");
    const todoId = e.target.getAttribute("data-todo-id");

    if (!action || !todoId) return;

    // Get selected projectId
    // const snapshot = AppController.getSnapshot();
    // const projectId = snapshot.selectedProjectId;
    const snapshot = AppController.getSnapshot();
    const projectId = snapshot.selectedProjectId;

    // Get the new value from e.target.value or e.target.checked
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    // Build updates object based on action:

    if (action === "update-title") {
      const updates = { title: value };
      AppController.updateTodo(projectId, todoId, updates);
    }

    if (action === "update-description") {
      const updates = { description: value };
      AppController.updateTodo(projectId, todoId, updates);
    }

    if (action === "update-due-date") {
      // Convert empty string to null for dueDate
      const updates = { dueDate: value || null };
      AppController.updateTodo(projectId, todoId, updates);
    }

    if (action === "update-priority") {
      const updates = { priority: value };
      AppController.updateTodo(projectId, todoId, updates);
    }

    if (action === "update-notes") {
      const updates = { notes: value };
      AppController.updateTodo(projectId, todoId, updates);
    }

    // if (action === 'toggle-complete')
    //   - Call toggleTodoComplete instead of updateTodo
    if (action === "toggle-complete") {
      AppController.toggleTodoComplete(projectId, todoId);
    }

    // Re-render: const snapshot = AppController.getSnapshot(); renderApp(rootEl, snapshot);
    const updateSnapshot = AppController.getSnapshot();
    renderApp(rootEl, updateSnapshot);
  });
}
