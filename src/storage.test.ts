import { beforeEach, describe, expect, it } from 'vitest'
import { loadTodos, saveTodos, STORAGE_KEY } from './storage'
import type { Todo } from './todos'

const sample: Todo[] = [
  { id: 'a', title: 'A', completed: true, createdAt: 1 },
  { id: 'b', title: 'B', completed: false, createdAt: 2 },
]

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns an empty list when nothing is stored', () => {
    expect(loadTodos()).toEqual([])
  })

  it('AC-5: round-trips todos including completed state', () => {
    saveTodos(sample)
    expect(loadTodos()).toEqual(sample)
  })

  it.each([
    ['invalid JSON', '{not json'],
    ['a non-array value', '{"id":"a"}'],
    ['malformed items', '[{"id":1,"title":null}]'],
  ])('AC-6: falls back to an empty list on %s', (_label, raw) => {
    localStorage.setItem(STORAGE_KEY, raw)
    expect(loadTodos()).toEqual([])
  })
})
