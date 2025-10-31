import { Todo, createProject, generateId } from "../core/models.js";
import { loadState, saveState } from "../core/store.js";

const AppController = (() => {
  // in-memory state
  let state = {
    projects: [],
    selectedProjectId: null,
  };

  function init() {
    // createProject({ id: generateId("proj"), name, todos: [], createdAt: now })
    // push into state.projects; set selectedProjectId; saveState(state)
    // return snapshot
  }

  // ----- Project operations -----
  function createProjectAndSelect(name) {
    // TODO: createProject({ id: generateId('proj'), name, todos: [], createdAt: now })
    // TODO: push into state.projects; set selectedProjectId; saveState(state)
    // TODO: return snapshot
  }

  function renameProject(projectId, newName) {
    // find project; set name; saveState
  }

  function deleteProject(projectId) {
    // guard against deleting the last project
    // remove it; if selected was deleted, select another; saveState
  }

  function selectProject(projectId) {
    // set selectedProjectId (if exists); saveState
  }

  // ----- Todo operations
  function addTodo(
    projectId,
    fields /* {title, description, dueDate, priority, notes} */
  ) {
    // instantiate Todo with defaults (completed:false, timestamps)
    // push into project.todos; saveState; return snapshot
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

  // Checklist functionality removed

  // ----- Derived state / selectors -----
  function getSnapshot() {
    // TODO: return deep-cloned, read-only-ish snapshot for the UI
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
