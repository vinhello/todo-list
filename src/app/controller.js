import { Todo, createProject, generateId } from "../core/models.js";
import { loadState, saveState } from "../core/store.js";

const AppController = (() => {
  // in-memory state
  let state = {
    projects: [],
    selectedProjectId: null,
  };

  function init() {
    // update in-memory state
    const loadedState = loadState();
    state.projects = loadedState.projects;
    state.selectedProjectId = loadedState.selectedProjectId;

    // return snapshot for initial render
    return getSnapshot();
  }

  // ----- PROJECT OPERATIONS -----
  function createProjectAndSelect(name) {
    // Create a project
    const project = createProject({
      name,
    });

    // Push project into state
    state.projects.push(project);

    // Set selectedProjectId
    state.selectedProjectId = project.id;

    // Save the state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function renameProject(projectId, newName) {
    // Validate name input
    if (!newName || newName.trim() === "") {
      throw new Error("Project name cannot be empty");
    }

    // Find project
    const foundProject = state.projects.find(
      (project) => project.id === projectId
    );

    // Error if project not found
    if (!foundProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    // Set name
    foundProject.name = newName;

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function deleteProject(projectId) {
    // Guard against deleting the last project
    if (state.projects.length < 2) {
      throw new Error("At least one project is required.");
    }

    // Find project index
    const index = state.projects.findIndex(
      (project) => project.id === projectId
    );

    // Error if project not found
    if (index === -1) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    // Used to check if the deleted project is the selected one
    const wasSelected = state.selectedProjectId === projectId;

    // Delete project
    state.projects.splice(index, 1);

    // Only update selection if the deleted project was selected
    // Checking length as another safety check before updating to the new project id
    if (wasSelected && state.projects.length > 0) {
      state.selectedProjectId = state.projects[0].id;
    }

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function selectProject(projectId) {
    // Find project
    const project = state.projects.find((project) => project.id === projectId);

    // Error if project not found
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    // Set selected project's id
    state.selectedProjectId = projectId;

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  // ----- TODO OPERATIONS

  // Add todo
  // fields = {title, description, dueDate, priority, notes}
  function addTodo(projectId, fields) {
    // Find project
    const foundProject = state.projects.find(
      (project) => project.id === projectId
    );

    // Error if project not found
    if (!foundProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    // Instantiate todo with defaults
    const todo = new Todo(fields);

    // Push todo into project
    foundProject.todos.push(todo);

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function updateTodo(projectId, todoId, updates) {
    // Guard against null/undefined updates
    if (!updates || typeof updates !== "object") {
      throw new Error("Updates must be an object");
    }

    // Find project
    const foundProject = state.projects.find(
      (project) => project.id === projectId
    );

    // Error if project not found
    if (!foundProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const foundTodo = foundProject.todos.find((todo) => todo.id === todoId);

    // Error if todo not found
    if (!foundTodo) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    // Update relevent fields
    if (updates.title !== undefined) {
      foundTodo.setTitle(updates.title);
    }

    if (updates.description !== undefined) {
      foundTodo.setDescription(updates.description);
    }

    if (updates.dueDate !== undefined) {
      foundTodo.setDueDate(updates.dueDate);
    }

    if (updates.priority !== undefined) {
      foundTodo.setPriority(updates.priority);
    }

    if (updates.notes !== undefined) {
      foundTodo.setNotes(updates.notes);
    }

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function toggleTodoComplete(projectId, todoId) {
    // Find project
    const foundProject = state.projects.find(
      (project) => project.id === projectId
    );

    // Error if project not found
    if (!foundProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const foundTodo = foundProject.todos.find((todo) => todo.id === todoId);

    // Error if todo not found
    if (!foundTodo) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    // Toggle todo complete status
    foundTodo.toggleComplete();

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function deleteTodo(projectId, todoId) {
    // Find project
    const foundProject = state.projects.find(
      (project) => project.id === projectId
    );

    // Error if project not found
    if (!foundProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    // Find index of todo
    const index = foundProject.todos.findIndex((todo) => todo.id === todoId);

    // Error if todo not found
    if (index === -1) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    // Delete todo
    foundProject.todos.splice(index, 1);

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  function moveTodo(projectIdFrom, projectIdTo, todoId) {
    // remove from one project, push into another; saveState

    // Find project moving todo from
    const fromProject = state.projects.find(
      (project) => project.id === projectIdFrom
    );

    // Error if from project not found
    if (!fromProject) {
      throw new Error(`Project with id ${projectIdFrom} not found`);
    }

    // Find project moving todo to
    const toProject = state.projects.find(
      (project) => project.id === projectIdTo
    );

    // Error if to project not found
    if (!toProject) {
      throw new Error(`Project with id ${projectIdTo} not found`);
    }

    // Find index of todo in "from" project
    const index = fromProject.todos.findIndex((todo) => todo.id === todoId);

    // Error if todo not found
    if (index === -1) {
      throw new Error(`Todo with id ${todoId} not found`);
    }

    // Get reference todo using the index
    const todoToMove = fromProject.todos[index];

    // Move todo to the "to" project
    toProject.todos.push(todoToMove);

    // Delete todo from "from" project
    fromProject.todos.splice(index, 1);

    // Save state
    saveState(state);

    // Return snapshot
    return getSnapshot();
  }

  // ----- Derived state / selectors -----
  function getSnapshot() {
    // Return deep-clone of current state for UI
    return structuredClone(state);
  }

  return {
    init,
    createProjectAndSelect,
    renameProject,
    deleteProject,
    selectProject,
    addTodo,
    updateTodo,
    toggleTodoComplete,
    deleteTodo,
    moveTodo,
    getSnapshot,
  };
})();

export default AppController;
