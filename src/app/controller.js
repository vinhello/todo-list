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
    // set selectedProjectId (if exists); saveState

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
    // instantiate Todo with defaults (completed:false, timestamps)
    // push into project.todos; saveState; return snapshot
    // CONTINUE HERE
  }

  function updateTodo(projectId, todoId, updates /* partial fields */) {
    // TODO: locate; assign changes via setter methods where relevant; saveState
  }

  function toggleTodoComplete(projectId, todoId) {
    // CODE
  }

  function deleteTodo(projectId, todoId) {
    // CODE
  }

  function moveTodo(projectIdFrom, projectIdTo, todoId) {
    // remove from one project, push into another; saveState
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
