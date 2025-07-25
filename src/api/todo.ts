import axios from 'axios';
import { Todo } from '../store/useTodoStore';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getTodos(token: string): Promise<Todo[]> {
  const res = await axios.get<Todo[]>(`${API_BASE_URL}/api/todos`, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function createTodo(
  data: {
    title: string;
    description?: string;
    category?: string;
    priority?: 'Low' | 'Medium' | 'High';
  },
  token: string
): Promise<Todo> {
  const res = await axios.post<Todo>(`${API_BASE_URL}/api/todos`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function updateTodo(
  id: string,
  data: { title?: string; description?: string; category?: string; priority?: 'Low' | 'Medium' | 'High' },
  token: string
): Promise<Todo> {
  const res = await axios.put<Todo>(`${API_BASE_URL}/api/todos/${id}`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function deleteTodo(id: string, token: string): Promise<Todo> {
  const res = await axios.delete<Todo>(`${API_BASE_URL}/api/todos/${id}`, {
    headers: authHeader(token),
  });
  return res.data;
}