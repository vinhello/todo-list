import AppController from "./app/controller.js";
import { attachHandlers } from "./ui/handlers.js";
import "./styles.css";

// TEMPORARILY EXPOSE FOR TESTING
import { Todo, createProject } from "./core/models.js";
import { saveState, loadState, clearState } from "./core/store.js";
import {
  renderApp,
  renderProjectList,
  renderTodoList,
  renderTodoDetail,
  applyPriorityBadge,
} from "./ui/view.js";
window.Todo = Todo;
window.createProject = createProject;
window.saveState = saveState;
window.loadState = loadState;
window.clearState = clearState;
window.AppController = AppController;
window.renderApp = renderApp;
window.renderProjectList = renderProjectList;
window.renderTodoList = renderTodoList;
window.renderTodoDetail = renderTodoDetail;
window.applyPriorityBadge = applyPriorityBadge;

// Listener for when the DOM finishes loading
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the app
  AppController.init();

  // Attach our handlers to the HTML content
  const app = document.querySelector("#app");
  attachHandlers(app);
});
