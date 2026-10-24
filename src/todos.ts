export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export function addTodo(list: Todo[], _title: string): Todo[] {
  return list
}

export function toggleTodo(list: Todo[], _id: string): Todo[] {
  return list
}

export function deleteTodo(list: Todo[], _id: string): Todo[] {
  return list
}
