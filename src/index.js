import AppController from "./app/controller.js";
import { attachHandlers } from "./ui/handlers.js";
import "./styles.css";

// Listener for when the DOM finishes loading
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the app and get initial snapshot
  AppController.init();

  // Attach our handlers to the HTML content
  const app = document.querySelector("#app");
  attachHandlers(app);
});
