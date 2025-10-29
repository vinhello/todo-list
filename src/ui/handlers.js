import AppController from "../app/controller.js";
import { renderApp } from "./view.js";

export function attachHandlers(rootEl) {
  // TODO: call initial render
  // TODO: addEventListener('click', ...) with event delegation:
  //   - new project button -> controller.createProjectAndSelect
  //   - select project     -> controller.selectProject
  //   - delete project     -> controller.deleteProject
  //   - add todo           -> controller.addTodo
  //   - toggle complete    -> controller.toggleTodoComplete
  //   - open detail pane   -> renderTodoDetail(...)
  //   - edit fields (input/change) -> controller.updateTodo
  //   - remove todo        -> controller.deleteTodo
  //   - move todo          -> controller.moveTodo
  // After each controller action:
  //   const snapshot = AppController.getSnapshot();
  //   renderApp(rootEl, snapshot);
}
