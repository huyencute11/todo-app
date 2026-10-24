import type { Todo } from './todos'

export const STORAGE_KEY = 'todos'

export function loadTodos(): Todo[] {
  throw new Error('not implemented')
}

export function saveTodos(_list: Todo[]): void {}
