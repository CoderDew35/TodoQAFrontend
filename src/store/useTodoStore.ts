import { create } from 'zustand';


export interface Todo {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High';
  createdAt?: string;
  updatedAt?: string;
}


export interface TodoState {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos: Todo[]) => set({ todos }),
  addTodo: (todo: Todo) => set((state) => ({ todos: [todo, ...state.todos] })),
  updateTodo: (todo: Todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t._id === todo._id ? { ...t, ...todo } : t)),
    })),
  removeTodo: (id: string) =>
    set((state) => ({ todos: state.todos.filter((t) => t._id !== id) })),
}));