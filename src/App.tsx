import { useState, type FormEvent } from 'react'
import { useTodos } from './useTodos'
import './App.css'

function App() {
  const { todos, add, toggle, remove } = useTodos()
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    add(title)
    setTitle('')
  }

  return (
    <main className="todo-app">
      <h1>Todos</h1>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          aria-label="New todo"
          placeholder="What needs doing?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty">No todos yet</p>
      ) : (
        <ul className="todo-list" aria-label="Todos">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : undefined}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggle(todo.id)}
                />
                <span>{todo.title}</span>
              </label>
              <button type="button" aria-label={`Delete ${todo.title}`} onClick={() => remove(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
