import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginApi(email, password);
      login(res.user, res.token);
      navigate('/todos');
    } catch (err: unknown) {
      // Use AxiosError typing to safely access response data
      const error = err as import('axios').AxiosError<{ message?: string }>;
      const message = error.response?.data?.message ?? 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">Login</h2>
        {error && (
          <div className="mb-4 text-red-600" data-testid="login-error">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-100"
              required
              data-testid="email-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-100"
              required
              data-testid="password-input"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none"
            data-testid="login-submit"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}