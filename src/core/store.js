// Data storage
const STORAGE_KEY = "todoapp.v1";

// Save entire app state (projects array + selected project id)
export function saveState(
  state /* { projects: Project[], selectedProjectId: string|null } */
) {
  // CODE: serialize with JSON.stringify; ensure Todos are converted via toJSON()
  // CODE: try/catch to avoid crashes
}

// Load & hydrate
export function loadState() {
  // CODE: read from localStorage
  // CODE: if missing/invalid, return a default state with a single "Inbox" project
  // CODE: rehydrate todos via Todo.fromJSON for each project
}

// Utilities
export function clearState() {
  // CODE: removeItem(STORAGE_KEY)
}

export function migrateIfNeeded(raw) {
  // CODE: handle future schema versions; return upgraded object
}
