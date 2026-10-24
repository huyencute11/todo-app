export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

/** Appends a new active todo. Returns the same list if the title is blank. */
export function addTodo(list: Todo[], title: string): Todo[] {
  const trimmed = title.trim()
  if (!trimmed) return list
  return [
    ...list,
    { id: crypto.randomUUID(), title: trimmed, completed: false, createdAt: Date.now() },
  ]
}

export function toggleTodo(list: Todo[], id: string): Todo[] {
  return list.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
}

export function deleteTodo(list: Todo[], id: string): Todo[] {
  return list.filter((todo) => todo.id !== id)
}
