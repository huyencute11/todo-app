import { useEffect, useState } from 'react'
import { loadTodos, saveTodos } from './storage'
import { addTodo, deleteTodo, toggleTodo, type Todo } from './todos'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  return {
    todos,
    add: (title: string) => setTodos((list) => addTodo(list, title)),
    toggle: (id: string) => setTodos((list) => toggleTodo(list, id)),
    remove: (id: string) => setTodos((list) => deleteTodo(list, id)),
  }
}
