import axios from 'axios';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface AuthResponse {
  user: { _id: string; email: string };
  token: string;
}

export async function register(email: string, password: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, { email, password });
  return res.data;
}