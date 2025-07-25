import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTodoStore, Todo } from '../store/useTodoStore';
import { getTodos, createTodo, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi } from '../api/todo';
import { getCategories, createCategory, Category } from '../api/category';
import TodoItem from '../components/TodoItem';


export default function TodoList() {
  const navigate = useNavigate();
  const { token, logout, user } = useAuthStore();
  const { todos, setTodos, addTodo, updateTodo, removeTodo } = useTodoStore();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // List of available categories
  const [categories, setCategories] = useState<Category[]>([]);
  // Selected category name; '__other__' sentinel indicates a new category will be created
  const [selectedCategory, setSelectedCategory] = useState('');
  // Name of the new category when 'Other' is selected
  const [newCategory, setNewCategory] = useState('');
  // Priority of the new todo
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on component mount
  useEffect(() => {
    async function fetchTodos() {
      if (!token) {
        return;
      }
      try {
        const data = await getTodos(token);
        setTodos(data);
      } catch (err: unknown) {
        console.error(err);
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, [token, setTodos]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCats() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCats();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      return;
    }
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      let categoryToUse = selectedCategory;
      // If the user selected Other, create a new category first
      if (selectedCategory === '__other__') {
        if (!newCategory.trim()) {
          setError('Please enter a new category name');
          return;
        }
        const created = await createCategory(newCategory.trim(), token);
        // Update categories list
        setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        categoryToUse = created.name;
        setNewCategory('');
      }
      const newTodo: Todo = await createTodo(
        {
          title: title.trim(),
          description: description.trim(),
          category: categoryToUse,
          priority,
        },
        token
      );
      addTodo(newTodo);
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setPriority('Medium');
      setError(null);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to create todo');
    }
  };

  const handleUpdate = async (
    id: string,
    data: { title?: string; description?: string; category?: string; priority?: 'Low' | 'Medium' | 'High' }
  ) => {
    if (!token) {
      return;
    }
    try {
      const updated: Todo = await updateTodoApi(id, data, token);
      updateTodo(updated);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      return;
    }
    try {
      await deleteTodoApi(id, token);
      removeTodo(id);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 ">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{user?.email} To Do's</h2>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 dark:bg-red-600 text-white rounded"
          data-testid="logout-button"
        >
          Logout
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600" data-testid="todo-error">
          {error}
        </div>
      )}
      <form onSubmit={handleCreate} className="mb-6 space-y-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            data-testid="new-title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            data-testid="new-description"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            data-testid="new-category-select"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="__other__">Other...</option>
          </select>
          {selectedCategory === '__other__' && (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="mt-2 block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              data-testid="new-category-input"
            />
          )}
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            data-testid="new-priority"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none"
          data-testid="create-button"
        >
          Add To do
        </button>
      </form>
      {todos.length === 0 ? (
        <p className="text-center text-gray-600">No todos yet.</p>
      ) : (
        <div>
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              categories={categories}
              onAddCategory={async (name: string) => {
                if (!token) return;
                const created = await createCategory(name, token);
                setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}