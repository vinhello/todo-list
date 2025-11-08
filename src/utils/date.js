export function formatDue(iso /* string|null */) {
  // TODO: if null, return 'No due date'; else format(ISO, 'PP')
  if (!iso) return "No due date";
  // Temporary simple formatting until date-fns is set up
  const date = new Date(iso);
  // Format as "MM/DD/YYYY" or use locale string
  return date.toLocaleDateString();
}

export function isOverdue(iso) {
  // TODO: compare to now
  if (!iso) return false;
  const dueDate = new Date(iso);
  const now = new Date();
  // Set both to midnight for date-only comparison
  dueDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return dueDate < now;
}

export function sortByDueThenPriority(todos) {
  // TODO
  if (!Array.isArray(todos)) return [];

  // Create a copy to avoid mutating the original array
  const sorted = [...todos];

  // Priority order: high = 3, med = 2, low = 1
  const priorityValue = (priority) => {
    if (priority === "high") return 3;
    if (priority === "med") return 2;
    return 1; // default to low
  };

  sorted.sort((a, b) => {
    // First, sort by due date
    // Todos with no due date go to the end
    if (!a.dueDate && !b.dueDate) {
      // Both have no due date, sort by priority (high first)
      return priorityValue(b.priority) - priorityValue(a.priority);
    }
    if (!a.dueDate) return 1; // a goes to end
    if (!b.dueDate) return -1; // b goes to end

    // Both have due dates, compare them
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);

    if (dateA < dateB) return -1; // a comes first
    if (dateA > dateB) return 1; // b comes first

    // Same due date, sort by priority (high first)
    return priorityValue(b.priority) - priorityValue(a.priority);
  });

  return sorted;
}
