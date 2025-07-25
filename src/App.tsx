import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList';
import { useAuthStore } from './store/useAuthStore';


export default function App() {
  const { token } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? '/todos' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={token ? <Navigate to="/todos" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/todos" replace /> : <Register />}
      />
      <Route
        path="/todos"
        element={token ? <TodoList /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}