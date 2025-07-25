import axios from 'axios';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface Category {
  _id: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
  return res.data;
}

export async function createCategory(name: string, token: string): Promise<Category> {
  const res = await axios.post<Category>(
    `${API_BASE_URL}/api/categories`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}