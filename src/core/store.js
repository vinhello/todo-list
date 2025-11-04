import { createProject, Todo } from "./models.js";

// Data storage
const STORAGE_KEY = "todoapp.v1";

// Save entire app state (projects array + selected project id)
export function saveState(state /* { projects, selectedProjectId } */) {
  try {
    // Validate input shape early (fail fast but safely).
    if (!state || typeof state !== "object")
      throw new Error("State must be an object ");
    if (!Array.isArray(state.projects)) throw new Error("Not an array");

    // 2) Normalize domain objects to plain JSON:
    const projectsForStorage = state.projects.map((project) => {
      // convert each todo to a plain object (via .toJSON if it's a class instance)
      const plainTodos = project.todos.map((todo) =>
        typeof todo.toJSON === "function" ? todo.toJSON() : todo
      );

      return {
        id: project.id,
        name: project.name,
        todos: plainTodos,
        createdAt: project.createdAt,
      };
    });

    // Build a persistable envelope (add metadata):
    const envelope = {
      version: 1,
      lastSavedAt: new Date().toISOString(),
      selectedProjectId: state.selectedProjectId ?? null,
      projects: projectsForStorage,
    };

    // Stringify safely
    const jsonString = JSON.stringify(envelope);

    // Persist to localStorage inside try/catch
    localStorage.setItem(STORAGE_KEY, jsonString);

    // optional success flag - return true on success, false on failure — helps controller decide whether to show a toast.
    return true;
  } catch (error) {
    // handle quota errors, private mode, or security errors.
    console.warn("Could not save state to local storage.", error);
    return false;
  }
}

// Load & hydrate
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const defaultProject = createProject({ name: "Inbox" });
      return {
        projects: [defaultProject],
        selectedProjectId: defaultProject.id,
      };
    }

    // Try to parse JSON string
    const envelope = JSON.parse(raw);

    const migrated = migrateIfNeeded(envelope);

    // Validate migrated structure
    if (!migrated || typeof migrated !== "object") {
      throw new Error("Invalid migrated structure");
    }
    if (!Array.isArray(migrated.projects)) {
      throw new Error("Invalid projects array");
    }

    // Rehydrate projects (use createProject to normalize todos)
    const hydratedProjects = migrated.projects.map((project) => {
      // Todos are already plain objects, convert to Todo instances
      const hydratedTodos = (project.todos || []).map((todo) =>
        Todo.fromJSON(todo)
      );

      return createProject({
        id: project.id,
        name: project.name,
        todos: hydratedTodos,
        createdAt: project.createdAt,
      });
    });

    // Return rehydrated state
    return {
      projects: hydratedProjects,
      selectedProjectId: migrated.selectedProjectId ?? null,
    };
  } catch (error) {
    console.warn("Could not load state from local storage.", error);
    // Return default state on error
    const defaultProject = createProject({ name: "Inbox" });
    return {
      projects: [defaultProject],
      selectedProjectId: defaultProject.id,
    };
  }
}

// Utilities
export function clearState() {
  // CODE: removeItem(STORAGE_KEY)
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn("Could not clear state from local storage.", error);
    return false;
  }
}

// If migrating versions
export function migrateIfNeeded(raw) {
  // Ensure input is an object
  if (!raw || typeof raw !== "object") {
    console.warn("migrateIfNeeded: invalid data, returning raw.");
    return raw;
  }

  // Read version number from the stored envelope
  const currentVersion = 1; // bump this if your schema changes later
  const savedVersion = raw.version ?? 0; // fallback if missing

  // If versions match, nothing to do.
  if (savedVersion === currentVersion) {
    return raw;
  }

  // If data is older, step through migrations incrementally
  let upgraded = { ...raw };

  if (savedVersion < 1) {
    // Example migration for version 0 to 1
    upgraded.version = 1;

    upgraded.projects =
      upgraded.projects?.map((project) => ({
        ...project,
        todos:
          project.todos?.map((todo) => ({
            priority: todo.priority || "low",
            ...todo,
          })) ?? [],
      })) ?? [];
  }

  // If data is newer than the app (user opened newer app then downgraded)
  if (savedVersion > currentVersion) {
    console.warn(
      `Stored data version (${savedVersion}) is newer than this app version (${currentVersion}).`
    );
    // choose to return as-is or strip unknown fields
    return raw;
  }

  // Return the upgraded envelope for use by loadState()
  return upgraded;
}
