import type { Todo } from './todos'

export const STORAGE_KEY = 'todos'

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.completed === 'boolean' &&
    typeof v.createdAt === 'number'
  )
}

/** Reads saved todos. Missing, unparsable or malformed data yields an empty list. */
export function loadTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isTodo) ? parsed : []
  } catch {
    // Corrupt data must not crash the app (AC-6); start with an empty list.
    return []
  }
}

/** Writes todos. A failed write (quota, storage disabled) keeps the in-memory list working. */
export function saveTodos(list: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (error) {
    console.error('Could not save todos', error)
  }
}
