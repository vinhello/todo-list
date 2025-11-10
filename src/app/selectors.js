// Derived or computed data state helpers
import { sortByDueThenPriority } from "../utils/date.js";

export function getProjects(state) {
  // Return list of projects with counts
  if (!state || !Array.isArray(state.projects)) {
    return [];
  }

  return state.projects.map((project) => {
    const todos = project.todos || [];
    const totalCount = todos.length;
    const completedCount = todos.filter((todo) => todo.completed).length;
    const incompleteCount = totalCount - completedCount;

    return {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      todoCount: totalCount,
      completedCount,
      incompleteCount,
    };
  });
}

export function getSelectedProject(state) {
  // Return the selected project object
  if (!state || !state.selectedProjectId) {
    return null;
  }

  return (
    state.projects?.find((project) => project.id === state.selectedProjectId) ||
    null
  );
}

export function getTodosForProject(state, projectId) {
  // Return array of todos for a project, sorted by dueDate/priority
  if (!state || !Array.isArray(state.projects)) {
    return [];
  }

  const project = state.projects.find((p) => p.id === projectId);
  if (!project || !Array.isArray(project.todos)) {
    return [];
  }

  // Use sortByDueThenPriority from date.js to sort todos
  return sortByDueThenPriority(project.todos);
}

export function groupTodosByPriority(todos) {
  // Group todos by priority: { high: [...], med: [...], low: [...] }
  if (!Array.isArray(todos)) {
    return {
      high: [],
      med: [],
      low: [],
    };
  }

  const grouped = {
    high: [],
    med: [],
    low: [],
  };

  todos.forEach((todo) => {
    const priority = todo.priority || "low";
    if (grouped[priority]) {
      grouped[priority].push(todo);
    } else {
      // If priority is invalid, default to low
      grouped.low.push(todo);
    }
  });

  return grouped;
}

export function filterTodosByDueRange(todos, { from, to }) {
  // Filter todos where dueDate is between from and to dates
  if (!Array.isArray(todos)) {
    return [];
  }

  // If no date range provided, return all todos
  if (!from && !to) {
    return todos;
  }

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  // Set time to midnight for date-only comparison
  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0);
  }
  if (toDate) {
    toDate.setHours(23, 59, 59, 999); // Include entire end date
  }

  return todos.filter((todo) => {
    // Skip todos without due dates
    if (!todo.dueDate) {
      return false;
    }

    const todoDate = new Date(todo.dueDate);
    todoDate.setHours(0, 0, 0, 0);

    // Check if todo date is within range
    if (fromDate && todoDate < fromDate) {
      return false;
    }
    if (toDate && todoDate > toDate) {
      return false;
    }

    return true;
  });
}
