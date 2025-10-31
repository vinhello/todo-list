import AppController from "./app/controller.js";
import { attachHandlers } from "./ui/handlers.js";
import "./styles.css";

// TEMPORARY EXPOSE FOR TESTING
import { Todo, createProject } from "./core/models.js";
window.Todo = Todo;
window.createProject = createProject;

// Listener for when the DOM finishes loading
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the app
  AppController.init();

  // Attach our handlers to the HTML content
  const app = document.querySelector("#app");
  attachHandlers(app);
});
