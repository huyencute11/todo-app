import { describe, expect, it } from 'vitest'
import { addTodo, deleteTodo, toggleTodo, type Todo } from './todos'

const todo = (id: string, title: string, completed = false): Todo => ({
  id,
  title,
  completed,
  createdAt: 0,
})

describe('addTodo', () => {
  it('AC-1: appends a trimmed, active todo with a unique id', () => {
    const first = addTodo([], '  Buy milk  ')
    const second = addTodo(first, 'Buy milk')

    expect(first).toHaveLength(1)
    expect(first[0]).toMatchObject({ title: 'Buy milk', completed: false })
    expect(second.map((t) => t.title)).toEqual(['Buy milk', 'Buy milk'])
    expect(second[0].id).not.toBe(second[1].id)
  })

  it.each(['', '   ', '\t\n'])('AC-2: rejects blank title %j', (title) => {
    const list = [todo('a', 'A')]
    expect(addTodo(list, title)).toBe(list)
  })

  it('does not mutate the input list', () => {
    const list: Todo[] = []
    addTodo(list, 'A')
    expect(list).toEqual([])
  })
})

describe('toggleTodo', () => {
  it('AC-3: completes the target only, and toggling again makes it active', () => {
    const list = [todo('a', 'A'), todo('b', 'B')]

    const done = toggleTodo(list, 'a')
    expect(done.map((t) => t.completed)).toEqual([true, false])
    expect(list[0].completed).toBe(false)

    const undone = toggleTodo(done, 'a')
    expect(undone.map((t) => t.completed)).toEqual([false, false])
  })
})

describe('deleteTodo', () => {
  it('AC-4: removes only the target todo', () => {
    const list = [todo('a', 'A'), todo('b', 'B')]
    expect(deleteTodo(list, 'a')).toEqual([todo('b', 'B')])
    expect(list).toHaveLength(2)
  })
})
